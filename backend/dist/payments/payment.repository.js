"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const payment_entity_1 = require("./payment.entity");
let PaymentRepository = class PaymentRepository {
    findByIdempotencyKey(manager, idempotencyKey) {
        return manager.getRepository(payment_entity_1.Payment).findOneBy({ idempotencyKey });
    }
    create(manager, values) {
        return manager.getRepository(payment_entity_1.Payment).save(manager.getRepository(payment_entity_1.Payment).create(values));
    }
    async sumForOrder(manager, orderId) {
        const row = await manager
            .getRepository(payment_entity_1.Payment)
            .createQueryBuilder('payments')
            .select('COALESCE(SUM(payments.amountKopecks), 0)', 'total')
            .where('payments.orderId = :orderId', { orderId })
            .getRawOne();
        return Number(row?.total ?? 0);
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)()
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map