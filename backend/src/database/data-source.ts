import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { InitialSchema1725100000000 } from './migrations/1725100000000-InitialSchema';

export function databaseOptions() {
  return {
    type: 'postgres' as const,
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? 5432),
    username: process.env.DATABASE_USER ?? 'payments',
    password: process.env.DATABASE_PASSWORD ?? 'payments',
    database: process.env.DATABASE_NAME ?? 'payments',
    entities: [Order, Payment],
    migrations: [InitialSchema1725100000000],
    synchronize: false,
  };
}

export default new DataSource(databaseOptions());
