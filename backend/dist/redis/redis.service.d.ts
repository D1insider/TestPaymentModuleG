import { OnModuleDestroy } from '@nestjs/common';
export declare class RedisService implements OnModuleDestroy {
    private readonly client;
    connect(): Promise<void>;
    ping(): Promise<string>;
    getPaymentHint(key: string): Promise<string | null>;
    rememberPayment(key: string, paymentId: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
