import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentRepository {
  findByIdempotencyKey(manager: EntityManager, idempotencyKey: string) {
    return manager.getRepository(Payment).findOneBy({ idempotencyKey });
  }

  create(manager: EntityManager, values: Pick<Payment, 'orderId' | 'idempotencyKey' | 'amountKopecks'>) {
    return manager.getRepository(Payment).save(manager.getRepository(Payment).create(values));
  }

  async sumForOrder(manager: EntityManager, orderId: string): Promise<number> {
    const row = await manager
      .getRepository(Payment)
      .createQueryBuilder('payments')
      .select('COALESCE(SUM(payments.amountKopecks), 0)', 'total')
      .where('payments.orderId = :orderId', { orderId })
      .getRawOne<{ total: string }>();
    return Number(row?.total ?? 0);
  }
}
