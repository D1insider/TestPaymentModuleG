import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { OrderSummary } from '../types';
import { Money } from './Money';
import { StatusBadge } from './StatusBadge';

const shortId = (id: string) => `№ ${id.slice(-4)}`;

export function OrderTable({ orders }: { orders: OrderSummary[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Заказ</th><th>К оплате</th><th>Оплачено</th><th>Остаток</th><th>Переплата</th><th>Статус</th><th>Платежи</th><th aria-label="Действие" /></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td><strong>{shortId(order.id)}</strong><small>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</small></td>
              <td><Money value={order.amount} /></td>
              <td><Money value={order.paid} tone={Number(order.paid) > 0 ? 'positive' : 'muted'} /></td>
              <td><Money value={order.remaining} tone={Number(order.remaining) > 0 ? 'warning' : 'muted'} /></td>
              <td><Money value={order.overpayment} tone={Number(order.overpayment) > 0 ? 'positive' : 'muted'} /></td>
              <td><StatusBadge status={order.status} /></td>
              <td>{order.paymentCount}</td>
              <td><Link className="icon-link" to={`/orders/${order.id}`} aria-label={`Открыть заказ ${shortId(order.id)}`}><ArrowUpRight size={18} /></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
