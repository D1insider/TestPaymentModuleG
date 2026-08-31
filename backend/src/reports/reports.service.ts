import { Injectable } from '@nestjs/common';
import { kopecksToRubles } from '../common/money';
import { OrderStatus } from '../orders/order-status.enum';
import { OrderRepository } from '../orders/order.repository';
import { presentOrder } from '../orders/order.presenter';

@Injectable()
export class ReportsService {
  constructor(private readonly orders: OrderRepository) {}

  async summary() {
    const rows = await this.orders.findAllWithTotals();
    const totals = rows.reduce(
      (result, row) => {
        const amount = Number(row.amountKopecks);
        const paid = Number(row.paidKopecks);
        result.amount += amount;
        result.paid += paid;
        result.remaining += Math.max(amount - paid, 0);
        result.overpayment += Math.max(paid - amount, 0);
        result.statuses[row.status as OrderStatus] += 1;
        return result;
      },
      {
        amount: 0,
        paid: 0,
        remaining: 0,
        overpayment: 0,
        statuses: { [OrderStatus.UNPAID]: 0, [OrderStatus.PARTIALLY_PAID]: 0, [OrderStatus.PAID]: 0 },
      },
    );
    return {
      orders: rows.map(presentOrder),
      totals: {
        amount: kopecksToRubles(totals.amount),
        paid: kopecksToRubles(totals.paid),
        remaining: kopecksToRubles(totals.remaining),
        overpayment: kopecksToRubles(totals.overpayment),
        ordersByStatus: totals.statuses,
      },
    };
  }
}
