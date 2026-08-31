import { DataSource, EntityManager } from 'typeorm';
import { Order } from './order.entity';
export interface OrderTotalsRow {
    id: string;
    amountKopecks: string;
    status: string;
    createdAt: Date;
    paidKopecks: string;
    paymentCount: string;
}
export declare class OrderRepository {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    findAllWithTotals(manager?: EntityManager): Promise<OrderTotalsRow[]>;
    findOneWithPayments(id: string, manager?: EntityManager): Promise<Order | null>;
}
