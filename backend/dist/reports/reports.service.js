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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const money_1 = require("../common/money");
const order_status_enum_1 = require("../orders/order-status.enum");
const order_repository_1 = require("../orders/order.repository");
const order_presenter_1 = require("../orders/order.presenter");
let ReportsService = class ReportsService {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    async summary() {
        const rows = await this.orders.findAllWithTotals();
        const totals = rows.reduce((result, row) => {
            const amount = Number(row.amountKopecks);
            const paid = Number(row.paidKopecks);
            result.amount += amount;
            result.paid += paid;
            result.remaining += Math.max(amount - paid, 0);
            result.overpayment += Math.max(paid - amount, 0);
            result.statuses[row.status] += 1;
            return result;
        }, {
            amount: 0,
            paid: 0,
            remaining: 0,
            overpayment: 0,
            statuses: { [order_status_enum_1.OrderStatus.UNPAID]: 0, [order_status_enum_1.OrderStatus.PARTIALLY_PAID]: 0, [order_status_enum_1.OrderStatus.PAID]: 0 },
        });
        return {
            orders: rows.map(order_presenter_1.presentOrder),
            totals: {
                amount: (0, money_1.kopecksToRubles)(totals.amount),
                paid: (0, money_1.kopecksToRubles)(totals.paid),
                remaining: (0, money_1.kopecksToRubles)(totals.remaining),
                overpayment: (0, money_1.kopecksToRubles)(totals.overpayment),
                ordersByStatus: totals.statuses,
            },
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repository_1.OrderRepository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map