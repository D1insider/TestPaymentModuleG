import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client = new Redis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  async connect(): Promise<void> {
    if (this.client.status === 'wait') await this.client.connect();
  }

  async ping(): Promise<string> {
    await this.connect();
    return this.client.ping();
  }

  async getPaymentHint(key: string): Promise<string | null> {
    try {
      await this.connect();
      return await this.client.get(`payment:idempotency:${key}`);
    } catch {
      return null;
    }
  }

  async rememberPayment(key: string, paymentId: string): Promise<void> {
    try {
      await this.connect();
      await this.client.set(`payment:idempotency:${key}`, paymentId, 'EX', 86400);
    } catch {
      // Redis is an optimization; PostgreSQL remains the source of truth.
    }
  }

  async onModuleDestroy() {
    if (this.client.status !== 'end') await this.client.quit().catch(() => undefined);
  }
}
