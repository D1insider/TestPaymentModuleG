import { EntityManager } from 'typeorm';
import { Payment } from './payment.entity';
export declare class PaymentRepository {
    findByIdempotencyKey(manager: EntityManager, idempotencyKey: string): Promise<Payment | null>;
    create(manager: EntityManager, values: Pick<Payment, 'orderId' | 'idempotencyKey' | 'amountKopecks'>): Promise<Payment>;
    sumForOrder(manager: EntityManager, orderId: string): Promise<number>;
}
