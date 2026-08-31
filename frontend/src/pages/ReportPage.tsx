import { useQuery } from '@tanstack/react-query';
import { BadgeRussianRuble, CircleCheckBig, CircleDashed, TrendingUp } from 'lucide-react';
import { api } from '../api';
import { Money } from '../components/Money';
import { OrderTable } from '../components/OrderTable';
import { ErrorView, Loading } from '../components/StateView';

export function ReportPage() {
  const query = useQuery({ queryKey: ['report'], queryFn: api.report });
  if (query.isLoading) return <Loading />;
  if (query.error) return <ErrorView error={query.error} retry={() => query.refetch()} />;
  const { orders, totals } = query.data!;
  return <>
    <div className="page-heading"><div><span className="eyebrow">Сводная аналитика</span><h1>Отчёт по платежам</h1><p>Общие итоги и детализация по каждому заказу.</p></div></div>
    <section className="report-metrics">
      <article><BadgeRussianRuble /><small>К оплате</small><strong><Money value={totals.amount} /></strong></article>
      <article><CircleCheckBig /><small>Принято</small><strong><Money value={totals.paid} tone="positive" /></strong></article>
      <article><CircleDashed /><small>Остаток</small><strong><Money value={totals.remaining} tone="warning" /></strong></article>
      <article><TrendingUp /><small>Переплата</small><strong><Money value={totals.overpayment} /></strong></article>
    </section>
    <section className="status-summary"><div><span className="dot dot--gray" />Не оплачены <strong>{totals.ordersByStatus.UNPAID}</strong></div><div><span className="dot dot--amber" />Частично <strong>{totals.ordersByStatus.PARTIALLY_PAID}</strong></div><div><span className="dot dot--green" />Оплачены <strong>{totals.ordersByStatus.PAID}</strong></div></section>
    <section className="panel"><div className="panel-head"><div><h2>Итоги по заказам</h2><p>Финансовая сверка по всем операциям</p></div></div><OrderTable orders={orders} /></section>
  </>;
}
