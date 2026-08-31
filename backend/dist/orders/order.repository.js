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
exports.OrderRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
let OrderRepository = class OrderRepository {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findAllWithTotals(manager = this.dataSource.manager) {
        return manager
            .getRepository(order_entity_1.Order)
            .createQueryBuilder('orders')
            .leftJoin('orders.payments', 'payments')
            .select('orders.id', 'id')
            .addSelect('orders.amountKopecks', 'amountKopecks')
            .addSelect('orders.status', 'status')
            .addSelect('orders.createdAt', 'createdAt')
            .addSelect('COALESCE(SUM(payments.amountKopecks), 0)', 'paidKopecks')
            .addSelect('COUNT(payments.id)', 'paymentCount')
            .groupBy('orders.id')
            .orderBy('orders.createdAt', 'ASC')
            .getRawMany();
    }
    async findOneWithPayments(id, manager = this.dataSource.manager) {
        return manager.getRepository(order_entity_1.Order).findOne({
            where: { id },
            relations: { payments: true },
            order: { payments: { createdAt: 'DESC' } },
        });
    }
};
exports.OrderRepository = OrderRepository;
exports.OrderRepository = OrderRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], OrderRepository);
//# sourceMappingURL=order.repository.js.map