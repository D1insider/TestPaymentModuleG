import type { OrderStatus } from '../types';

const labels: Record<OrderStatus, string> = {
  UNPAID: 'Не оплачен',
  PARTIALLY_PAID: 'Частично оплачен',
  PAID: 'Оплачен',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status status--${status.toLowerCase()}`}>{labels[status]}</span>;
}
