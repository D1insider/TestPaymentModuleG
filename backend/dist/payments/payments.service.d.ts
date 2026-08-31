import { DataSource } from 'typeorm';
import { OrderStatus } from '../orders/order-status.enum';
import { OrdersService } from '../orders/orders.service';
import { RedisService } from '../redis/redis.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './payment.repository';
export declare class PaymentsService {
    private readonly dataSource;
    private readonly payments;
    private readonly ordersService;
    private readonly redis;
    constructor(dataSource: DataSource, payments: PaymentRepository, ordersService: OrdersService, redis: RedisService);
    create(orderId: string, dto: CreatePaymentDto): Promise<{
        created: boolean;
        duplicate: boolean;
        paymentId: string;
        order: {
            id: string;
            amount: string;
            paid: string;
            remaining: string;
            overpayment: string;
            status: OrderStatus;
            createdAt: Date;
            paymentCount: number;
            payments: {
                id: string;
                idempotencyKey: string;
                amount: string;
                createdAt: Date;
            }[];
        };
    }>;
    private duplicateResult;
}
