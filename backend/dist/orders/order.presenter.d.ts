import { OrderTotalsRow } from './order.repository';
export declare function presentOrder(row: OrderTotalsRow): {
    id: string;
    amount: string;
    paid: string;
    remaining: string;
    overpayment: string;
    status: string;
    paymentCount: number;
    createdAt: Date;
};
