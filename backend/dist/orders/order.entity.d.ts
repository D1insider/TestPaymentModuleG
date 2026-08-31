import { Payment } from '../payments/payment.entity';
import { OrderStatus } from './order-status.enum';
export declare class Order {
    id: string;
    amountKopecks: string;
    status: OrderStatus;
    createdAt: Date;
    payments: Payment[];
}
