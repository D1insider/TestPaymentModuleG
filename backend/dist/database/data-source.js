"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseOptions = databaseOptions;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../orders/order.entity");
const payment_entity_1 = require("../payments/payment.entity");
const _1725100000000_InitialSchema_1 = require("./migrations/1725100000000-InitialSchema");
function databaseOptions() {
    return {
        type: 'postgres',
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: Number(process.env.DATABASE_PORT ?? 5432),
        username: process.env.DATABASE_USER ?? 'payments',
        password: process.env.DATABASE_PASSWORD ?? 'payments',
        database: process.env.DATABASE_NAME ?? 'payments',
        entities: [order_entity_1.Order, payment_entity_1.Payment],
        migrations: [_1725100000000_InitialSchema_1.InitialSchema1725100000000],
        synchronize: false,
    };
}
exports.default = new typeorm_1.DataSource(databaseOptions());
//# sourceMappingURL=data-source.js.map