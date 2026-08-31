export type OrderStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';

export interface OrderSummary {
  id: string;
  amount: string;
  paid: string;
  remaining: string;
  overpayment: string;
  status: OrderStatus;
  paymentCount: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  idempotencyKey: string;
  amount: string;
  createdAt: string;
}

export interface OrderDetail extends OrderSummary { payments: Payment[] }

export interface Report {
  orders: OrderSummary[];
  totals: {
    amount: string;
    paid: string;
    remaining: string;
    overpayment: string;
    ordersByStatus: Record<OrderStatus, number>;
  };
}
