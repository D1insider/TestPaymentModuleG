import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { InitialSchema1725100000000 } from './migrations/1725100000000-InitialSchema';
export declare function databaseOptions(): {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: (typeof Payment | typeof Order)[];
    migrations: (typeof InitialSchema1725100000000)[];
    synchronize: boolean;
};
declare const _default: DataSource;
export default _default;
