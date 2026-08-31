"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentOrder = presentOrder;
const money_1 = require("../common/money");
function presentOrder(row) {
    const amount = Number(row.amountKopecks);
    const paid = Number(row.paidKopecks);
    return {
        id: row.id,
        amount: (0, money_1.kopecksToRubles)(amount),
        paid: (0, money_1.kopecksToRubles)(paid),
        remaining: (0, money_1.kopecksToRubles)(Math.max(amount - paid, 0)),
        overpayment: (0, money_1.kopecksToRubles)(Math.max(paid - amount, 0)),
        status: row.status,
        paymentCount: Number(row.paymentCount),
        createdAt: row.createdAt,
    };
}
//# sourceMappingURL=order.presenter.js.map