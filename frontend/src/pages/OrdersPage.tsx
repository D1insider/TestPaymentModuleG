import { useQuery } from '@tanstack/react-query';
import { CircleCheckBig, Clock3, ReceiptText } from 'lucide-react';
import { api } from '../api';
import { Money } from '../components/Money';
import { OrderTable } from '../components/OrderTable';
import { ErrorView, Loading } from '../components/StateView';

export function OrdersPage() {
  const query = useQuery({ queryKey: ['orders'], queryFn: api.orders });
  if (query.isLoading) return <Loading />;
  if (query.error) return <ErrorView error={query.error} retry={() => query.refetch()} />;
  const orders = query.data ?? [];
  const total = orders.reduce((sum, order) => sum + Number(order.amount), 0).toFixed(2);
  const paid = orders.reduce((sum, order) => sum + Number(order.paid), 0).toFixed(2);
  return (
    <>
      <div className="page-heading"><div><span className="eyebrow">Операционный обзор</span><h1>Заказы и платежи</h1><p>Актуальное состояние расчётов по всем тестовым заказам.</p></div><span className="updated"><Clock3 size={15} /> Обновлено сейчас</span></div>
      <section className="metrics">
        <article><span className="metric-icon"><ReceiptText /></span><div><small>Всего заказов</small><strong>{orders.length}</strong></div></article>
        <article><span className="metric-icon metric-icon--blue"><CircleCheckBig /></span><div><small>Принято платежей</small><strong><Money value={paid} /></strong></div></article>
        <article><div><small>Объём заказов</small><strong><Money value={total} /></strong></div></article>
      </section>
      <section className="panel"><div className="panel-head"><div><h2>Реестр заказов</h2><p>{orders.length} записей · суммы рассчитаны по платежам</p></div></div><OrderTable orders={orders} /></section>
    </>
  );
}
