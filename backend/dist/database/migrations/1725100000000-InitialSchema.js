"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema1725100000000 = void 0;
class InitialSchema1725100000000 {
    name = 'InitialSchema1725100000000';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "orders_status_enum" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID')`);
        await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "amount_kopecks" bigint NOT NULL CHECK ("amount_kopecks" > 0),
        "status" "orders_status_enum" NOT NULL DEFAULT 'UNPAID',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "pk_orders" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "order_id" uuid NOT NULL,
        "idempotency_key" varchar(100) NOT NULL,
        "amount_kopecks" bigint NOT NULL CHECK ("amount_kopecks" > 0),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "pk_payments" PRIMARY KEY ("id"),
        CONSTRAINT "uq_payments_idempotency_key" UNIQUE ("idempotency_key"),
        CONSTRAINT "fk_payments_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`CREATE INDEX "idx_payments_order_id" ON "payments" ("order_id")`);
        await queryRunner.query(`
      INSERT INTO "orders" ("id", "amount_kopecks", "created_at") VALUES
        ('10000000-0000-4000-8000-000000000001', 125000, now() - interval '12 days'),
        ('10000000-0000-4000-8000-000000000002', 89990, now() - interval '11 days'),
        ('10000000-0000-4000-8000-000000000003', 240000, now() - interval '10 days'),
        ('10000000-0000-4000-8000-000000000004', 157500, now() - interval '9 days'),
        ('10000000-0000-4000-8000-000000000005', 49900, now() - interval '8 days'),
        ('10000000-0000-4000-8000-000000000006', 315000, now() - interval '7 days'),
        ('10000000-0000-4000-8000-000000000007', 75000, now() - interval '6 days'),
        ('10000000-0000-4000-8000-000000000008', 180000, now() - interval '5 days'),
        ('10000000-0000-4000-8000-000000000009', 99990, now() - interval '4 days'),
        ('10000000-0000-4000-8000-000000000010', 420000, now() - interval '3 days'),
        ('10000000-0000-4000-8000-000000000011', 63250, now() - interval '2 days'),
        ('10000000-0000-4000-8000-000000000012', 210000, now() - interval '1 day')
      ON CONFLICT ("id") DO NOTHING
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "orders_status_enum"`);
    }
}
exports.InitialSchema1725100000000 = InitialSchema1725100000000;
//# sourceMappingURL=1725100000000-InitialSchema.js.map