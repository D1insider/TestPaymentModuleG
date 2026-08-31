"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    client = new ioredis_1.default({
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
        lazyConnect: true,
        maxRetriesPerRequest: 1,
    });
    async connect() {
        if (this.client.status === 'wait')
            await this.client.connect();
    }
    async ping() {
        await this.connect();
        return this.client.ping();
    }
    async getPaymentHint(key) {
        try {
            await this.connect();
            return await this.client.get(`payment:idempotency:${key}`);
        }
        catch {
            return null;
        }
    }
    async rememberPayment(key, paymentId) {
        try {
            await this.connect();
            await this.client.set(`payment:idempotency:${key}`, paymentId, 'EX', 86400);
        }
        catch {
        }
    }
    async onModuleDestroy() {
        if (this.client.status !== 'end')
            await this.client.quit().catch(() => undefined);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)()
], RedisService);
//# sourceMappingURL=redis.service.js.map