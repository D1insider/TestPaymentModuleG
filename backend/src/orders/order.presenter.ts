import { kopecksToRubles } from '../common/money';
import { OrderTotalsRow } from './order.repository';

export function presentOrder(row: OrderTotalsRow) {
  const amount = Number(row.amountKopecks);
  const paid = Number(row.paidKopecks);
  return {
    id: row.id,
    amount: kopecksToRubles(amount),
    paid: kopecksToRubles(paid),
    remaining: kopecksToRubles(Math.max(amount - paid, 0)),
    overpayment: kopecksToRubles(Math.max(paid - amount, 0)),
    status: row.status,
    paymentCount: Number(row.paymentCount),
    createdAt: row.createdAt,
  };
}
