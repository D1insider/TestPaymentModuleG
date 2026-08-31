import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from '../payments/payment.entity';
import { OrderStatus } from './order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'amount_kopecks', type: 'bigint' })
  amountKopecks!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.UNPAID })
  status!: OrderStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];
}
