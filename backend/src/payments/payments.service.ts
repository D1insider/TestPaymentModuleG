import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { parseRublesToKopecks } from '../common/money';
import { Order } from '../orders/order.entity';
import { OrderStatus } from '../orders/order-status.enum';
import { OrdersService } from '../orders/orders.service';
import { RedisService } from '../redis/redis.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './payment.entity';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly payments: PaymentRepository,
    private readonly ordersService: OrdersService,
    private readonly redis: RedisService,
  ) {}

  async create(orderId: string, dto: CreatePaymentDto) {
    let amountKopecks: number;
    try {
      amountKopecks = parseRublesToKopecks(dto.amount);
    } catch (error) {
      throw new ConflictException((error as Error).message);
    }

    const hint = await this.redis.getPaymentHint(dto.idempotencyKey);
    if (hint) {
      const cached = await this.dataSource.getRepository(Payment).findOneBy({ id: hint, idempotencyKey: dto.idempotencyKey });
      if (cached) return this.duplicateResult(orderId, cached);
    }

    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    let payment: Payment;
    let created = false;
    try {
      const order = await runner.manager
        .getRepository(Order)
        .createQueryBuilder('orders')
        .setLock('pessimistic_write')
        .where('orders.id = :orderId', { orderId })
        .getOne();
      if (!order) throw new NotFoundException('Заказ не найден');

      const existing = await this.payments.findByIdempotencyKey(runner.manager, dto.idempotencyKey);
      if (existing) {
        if (existing.orderId !== orderId) throw new ConflictException('idempotencyKey уже использован для другого заказа');
        payment = existing;
      } else {
        payment = await this.payments.create(runner.manager, {
          orderId,
          idempotencyKey: dto.idempotencyKey,
          amountKopecks: String(amountKopecks),
        });
        created = true;
        const paid = await this.payments.sumForOrder(runner.manager, orderId);
        order.status = paid >= Number(order.amountKopecks)
          ? OrderStatus.PAID
          : paid > 0
            ? OrderStatus.PARTIALLY_PAID
            : OrderStatus.UNPAID;
        await runner.manager.getRepository(Order).save(order);
      }
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }

    await this.redis.rememberPayment(dto.idempotencyKey, payment.id);
    return {
      created,
      duplicate: !created,
      paymentId: payment.id,
      order: await this.ordersService.findOne(orderId),
    };
  }

  private async duplicateResult(orderId: string, payment: Payment) {
    if (payment.orderId !== orderId) throw new ConflictException('idempotencyKey уже использован для другого заказа');
    return { created: false, duplicate: true, paymentId: payment.id, order: await this.ordersService.findOne(orderId) };
  }
}
