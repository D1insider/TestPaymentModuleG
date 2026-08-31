import { Response } from 'express';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly payments;
    constructor(payments: PaymentsService);
    create(orderId: string, dto: CreatePaymentDto, response: Response): Promise<{
        created: boolean;
        duplicate: boolean;
        paymentId: string;
        order: {
            id: string;
            amount: string;
            paid: string;
            remaining: string;
            overpayment: string;
            status: import("../orders/order-status.enum").OrderStatus;
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
}
