import { Injectable, NotFoundException } from '@nestjs/common';
import { kopecksToRubles } from '../common/money';
import { OrderRepository } from './order.repository';
import { presentOrder } from './order.presenter';

@Injectable()
export class OrdersService {
  constructor(private readonly orders: OrderRepository) {}

  async findAll() {
    return (await this.orders.findAllWithTotals()).map(presentOrder);
  }

  async findOne(id: string) {
    const order = await this.orders.findOneWithPayments(id);
    if (!order) throw new NotFoundException('Заказ не найден');
    const paid = order.payments.reduce((sum, payment) => sum + Number(payment.amountKopecks), 0);
    const amount = Number(order.amountKopecks);
    return {
      id: order.id,
      amount: kopecksToRubles(amount),
      paid: kopecksToRubles(paid),
      remaining: kopecksToRubles(Math.max(amount - paid, 0)),
      overpayment: kopecksToRubles(Math.max(paid - amount, 0)),
      status: order.status,
      createdAt: order.createdAt,
      paymentCount: order.payments.length,
      payments: order.payments.map((payment) => ({
        id: payment.id,
        idempotencyKey: payment.idempotencyKey,
        amount: kopecksToRubles(Number(payment.amountKopecks)),
        createdAt: payment.createdAt,
      })),
    };
  }
}
