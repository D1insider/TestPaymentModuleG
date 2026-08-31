import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly orders;
    constructor(orders: OrdersService);
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
