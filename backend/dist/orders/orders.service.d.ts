import { OrderRepository } from './order.repository';
export declare class OrdersService {
    private readonly orders;
    constructor(orders: OrderRepository);
    findAll(): Promise<{
        id: string;
        amount: string;
        paid: string;
        remaining: string;
        overpayment: string;
        status: string;
        paymentCount: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        amount: string;
        paid: string;
        remaining: string;
        overpayment: string;
        status: import("./order-status.enum").OrderStatus;
        createdAt: Date;
        paymentCount: number;
        payments: {
            id: string;
            idempotencyKey: string;
            amount: string;
            createdAt: Date;
        }[];
    }>;
}
