"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const money_1 = require("../common/money");
const order_entity_1 = require("../orders/order.entity");
const order_status_enum_1 = require("../orders/order-status.enum");
const orders_service_1 = require("../orders/orders.service");
const redis_service_1 = require("../redis/redis.service");
const payment_entity_1 = require("./payment.entity");
const payment_repository_1 = require("./payment.repository");
let PaymentsService = class PaymentsService {
    dataSource;
    payments;
    ordersService;
    redis;
    constructor(dataSource, payments, ordersService, redis) {
        this.dataSource = dataSource;
        this.payments = payments;
        this.ordersService = ordersService;
        this.redis = redis;
    }
    async create(orderId, dto) {
        let amountKopecks;
        try {
            amountKopecks = (0, money_1.parseRublesToKopecks)(dto.amount);
        }
        catch (error) {
            throw new common_1.ConflictException(error.message);
        }
        const hint = await this.redis.getPaymentHint(dto.idempotencyKey);
        if (hint) {
            const cached = await this.dataSource.getRepository(payment_entity_1.Payment).findOneBy({ id: hint, idempotencyKey: dto.idempotencyKey });
            if (cached)
                return this.duplicateResult(orderId, cached);
        }
        const runner = this.dataSource.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        let payment;
        let created = false;
        try {
            const order = await runner.manager
                .getRepository(order_entity_1.Order)
                .createQueryBuilder('orders')
                .setLock('pessimistic_write')
                .where('orders.id = :orderId', { orderId })
                .getOne();
            if (!order)
                throw new common_1.NotFoundException('Заказ не найден');
            const existing = await this.payments.findByIdempotencyKey(runner.manager, dto.idempotencyKey);
            if (existing) {
                if (existing.orderId !== orderId)
                    throw new common_1.ConflictException('idempotencyKey уже использован для другого заказа');
                payment = existing;
            }
            else {
                payment = await this.payments.create(runner.manager, {
                    orderId,
                    idempotencyKey: dto.idempotencyKey,
                    amountKopecks: String(amountKopecks),
                });
                created = true;
                const paid = await this.payments.sumForOrder(runner.manager, orderId);
                order.status = paid >= Number(order.amountKopecks)
                    ? order_status_enum_1.OrderStatus.PAID
                    : paid > 0
                        ? order_status_enum_1.OrderStatus.PARTIALLY_PAID
                        : order_status_enum_1.OrderStatus.UNPAID;
                await runner.manager.getRepository(order_entity_1.Order).save(order);
            }
            await runner.commitTransaction();
        }
        catch (error) {
            await runner.rollbackTransaction();
            throw error;
        }
        finally {
            await runner.release();
        }
        await this.redis.rememberPayment(dto.idempotencyKey, payment.id);
        return {
            created,
            duplicate: !created,
            paymentId: payment.id,
            order: await this.ordersService.findOne(orderId),
        };
    }
    async duplicateResult(orderId, payment) {
        if (payment.orderId !== orderId)
            throw new common_1.ConflictException('idempotencyKey уже использован для другого заказа');
        return { created: false, duplicate: true, paymentId: payment.id, order: await this.ordersService.findOne(orderId) };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        payment_repository_1.PaymentRepository,
        orders_service_1.OrdersService,
        redis_service_1.RedisService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map