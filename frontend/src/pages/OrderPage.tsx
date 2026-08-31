import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2, CopyCheck, CreditCard, History } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { Money } from '../components/Money';
import { ErrorView, Loading } from '../components/StateView';
import { StatusBadge } from '../components/StatusBadge';

export function OrderPage() {
  const { id = '' } = useParams();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['order', id], queryFn: () => api.order(id) });
  const [amount, setAmount] = useState('');
  const [key, setKey] = useState('');
  const [notice, setNotice] = useState<{ duplicate: boolean } | null>(null);
  const mutation = useMutation({
    mutationFn: () => api.addPayment(id, { amount, idempotencyKey: key }),
    onSuccess: (result) => {
      client.setQueryData(['order', id], result.order);
      client.invalidateQueries({ queryKey: ['orders'] });
      client.invalidateQueries({ queryKey: ['report'] });
      setNotice({ duplicate: result.duplicate });
      if (!result.duplicate) { setAmount(''); setKey(''); }
    },
  });
  const submit = (event: FormEvent) => { event.preventDefault(); setNotice(null); mutation.mutate(); };
  if (query.isLoading) return <Loading />;
  if (query.error) return <ErrorView error={query.error} retry={() => query.refetch()} />;
  const order = query.data!;
  return (
    <>
      <Link className="back" to="/"><ArrowLeft size={17} /> К реестру заказов</Link>
      <div className="detail-title"><div><span className="eyebrow">Карточка заказа</span><h1>Заказ № {order.id.slice(-4)}</h1><p className="mono">{order.id}</p></div><StatusBadge status={order.status} /></div>
      <section className="detail-metrics">
        <article><small>Сумма заказа</small><strong><Money value={order.amount} /></strong></article>
        <article><small>Оплачено</small><strong><Money value={order.paid} tone="positive" /></strong></article>
        <article><small>Остаток</small><strong><Money value={order.remaining} tone="warning" /></strong></article>
        <article><small>Переплата</small><strong><Money value={order.overpayment} /></strong></article>
      </section>
      <div className="detail-grid">
        <section className="panel form-panel"><div className="section-title"><CreditCard /><div><h2>Добавить платёж</h2><p>Сумма в рублях, ключ внешней операции — уникальный.</p></div></div>
          <form onSubmit={submit}>
            <label>Сумма платежа<input inputMode="decimal" placeholder="Например, 1250.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(',', '.'))} required /></label>
            <label>Idempotency key<input className="mono" placeholder="pay-demo-001" value={key} onChange={(e) => setKey(e.target.value)} minLength={3} required /></label>
            {mutation.error && <div className="inline-error">{mutation.error.message}</div>}
            {notice && <div className={`notice ${notice.duplicate ? 'notice--duplicate' : ''}`}>{notice.duplicate ? <CopyCheck /> : <CheckCircle2 />}<span><strong>{notice.duplicate ? 'Повтор распознан' : 'Платёж принят'}</strong>{notice.duplicate ? 'Сумма заказа не изменилась.' : 'Итоги заказа обновлены.'}</span></div>}
            <button className="primary" disabled={mutation.isPending}>{mutation.isPending ? 'Проводим платёж…' : 'Добавить платёж'}</button>
          </form>
        </section>
        <section className="panel history"><div className="section-title"><History /><div><h2>История платежей</h2><p>{order.paymentCount} операций</p></div></div>
          {order.payments.length === 0 ? <div className="empty">Платежей пока нет</div> : <div className="payment-list">{order.payments.map((payment) => <article key={payment.id}><div><strong><Money value={payment.amount} /></strong><span>{new Date(payment.createdAt).toLocaleString('ru-RU')}</span></div><code>{payment.idempotencyKey}</code></article>)}</div>}
        </section>
      </div>
    </>
  );
}
