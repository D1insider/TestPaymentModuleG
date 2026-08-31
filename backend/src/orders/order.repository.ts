import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Order } from './order.entity';

export interface OrderTotalsRow {
  id: string;
  amountKopecks: string;
  status: string;
  createdAt: Date;
  paidKopecks: string;
  paymentCount: string;
}

@Injectable()
export class OrderRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAllWithTotals(manager: EntityManager = this.dataSource.manager): Promise<OrderTotalsRow[]> {
    return manager
      .getRepository(Order)
      .createQueryBuilder('orders')
      .leftJoin('orders.payments', 'payments')
      .select('orders.id', 'id')
      .addSelect('orders.amountKopecks', 'amountKopecks')
      .addSelect('orders.status', 'status')
      .addSelect('orders.createdAt', 'createdAt')
      .addSelect('COALESCE(SUM(payments.amountKopecks), 0)', 'paidKopecks')
      .addSelect('COUNT(payments.id)', 'paymentCount')
      .groupBy('orders.id')
      .orderBy('orders.createdAt', 'ASC')
      .getRawMany<OrderTotalsRow>();
  }

  async findOneWithPayments(id: string, manager: EntityManager = this.dataSource.manager) {
    return manager.getRepository(Order).findOne({
      where: { id },
      relations: { payments: true },
      order: { payments: { createdAt: 'DESC' } },
    });
  }
}
