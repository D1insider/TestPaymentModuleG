import { Order } from '../orders/order.entity';
export declare class Payment {
    id: string;
    orderId: string;
    idempotencyKey: string;
    amountKopecks: string;
    createdAt: Date;
    order: Order;
}
