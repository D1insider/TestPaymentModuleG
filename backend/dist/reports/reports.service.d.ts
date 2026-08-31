import { OrderRepository } from '../orders/order.repository';
export declare class ReportsService {
    private readonly orders;
    constructor(orders: OrderRepository);
    summary(): Promise<{
        orders: {
            id: string;
            amount: string;
            paid: string;
            remaining: string;
            overpayment: string;
            status: string;
            paymentCount: number;
            createdAt: Date;
        }[];
        totals: {
            amount: string;
            paid: string;
            remaining: string;
            overpayment: string;
            ordersByStatus: {
                UNPAID: number;
                PARTIALLY_PAID: number;
                PAID: number;
            };
        };
    }>;
}
