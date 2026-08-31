import type { OrderDetail, OrderSummary, Report } from './types';

const API = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.error?.message;
    throw new Error(Array.isArray(message) ? message.join('. ') : message || 'Не удалось выполнить запрос');
  }
  return body as T;
}

export const api = {
  orders: () => request<OrderSummary[]>('/orders'),
  order: (id: string) => request<OrderDetail>(`/orders/${id}`),
  report: () => request<Report>('/reports/summary'),
  addPayment: (id: string, data: { amount: string; idempotencyKey: string }) =>
    request<{ created: boolean; duplicate: boolean; paymentId: string; order: OrderDetail }>(`/orders/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
