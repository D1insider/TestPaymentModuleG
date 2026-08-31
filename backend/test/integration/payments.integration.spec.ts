import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/http-exception.filter';
import { Order } from '../../src/orders/order.entity';
import { OrderStatus } from '../../src/orders/order-status.enum';

describe('Payments API with real PostgreSQL transactions', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  const createdOrderIds: string[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    dataSource = app.get(DataSource);
  });

  afterAll(async () => {
    if (createdOrderIds.length) await dataSource.getRepository(Order).delete(createdOrderIds);
    await app.close();
  });

  async function createOrder(amountKopecks: number) {
    const order = await dataSource.getRepository(Order).save({ amountKopecks: String(amountKopecks), status: OrderStatus.UNPAID });
    createdOrderIds.push(order.id);
    return order;
  }

  const payment = (orderId: string, amount: string, idempotencyKey: string) =>
    request(app.getHttpServer()).post(`/api/orders/${orderId}/payments`).send({ amount, idempotencyKey });

  it('handles a first partial payment', async () => {
    const order = await createOrder(10000);
    const response = await payment(order.id, '25.50', `partial-${order.id}`).expect(201);
    expect(response.body.created).toBe(true);
    expect(response.body.order).toMatchObject({ paid: '25.50', remaining: '74.50', status: 'PARTIALLY_PAID', paymentCount: 1 });
  });

  it('handles several payments until fully paid', async () => {
    const order = await createOrder(10000);
    await payment(order.id, '35.00', `full-a-${order.id}`).expect(201);
    const response = await payment(order.id, '65.00', `full-b-${order.id}`).expect(201);
    expect(response.body.order).toMatchObject({ paid: '100.00', remaining: '0.00', status: 'PAID', paymentCount: 2 });
  });

  it('allows overpayment and exposes it separately', async () => {
    const order = await createOrder(10000);
    const response = await payment(order.id, '125.75', `over-${order.id}`).expect(201);
    expect(response.body.order).toMatchObject({ paid: '125.75', remaining: '0.00', overpayment: '25.75', status: 'PAID' });
  });

  it('returns an idempotent duplicate without another payment', async () => {
    const order = await createOrder(10000);
    const key = `duplicate-${order.id}`;
    const first = await payment(order.id, '40.00', key).expect(201);
    const second = await payment(order.id, '40.00', key).expect(200);
    expect(second.body).toMatchObject({ created: false, duplicate: true, paymentId: first.body.paymentId });
    expect(second.body.order).toMatchObject({ paid: '40.00', paymentCount: 1 });
  });

  it('creates only one row for two parallel requests with the same key', async () => {
    const order = await createOrder(10000);
    const key = `parallel-same-${order.id}`;
    const responses = await Promise.all([payment(order.id, '30.00', key), payment(order.id, '30.00', key)]);
    expect(responses.map((item) => item.status).sort()).toEqual([200, 201]);
    const count = await dataSource.query('SELECT COUNT(*)::int AS count FROM payments WHERE order_id = $1', [order.id]);
    expect(count[0].count).toBe(1);
  });

  it('does not lose parallel payments with different keys for one order', async () => {
    const order = await createOrder(10000);
    const responses = await Promise.all(
      ['10.00', '20.00', '30.00', '40.00'].map((amount, index) => payment(order.id, amount, `parallel-${index}-${order.id}`)),
    );
    expect(responses.every((item) => item.status === 201)).toBe(true);
    const detail = await request(app.getHttpServer()).get(`/api/orders/${order.id}`).expect(200);
    expect(detail.body).toMatchObject({ paid: '100.00', status: 'PAID', paymentCount: 4 });
  });

  it('rejects invalid amount and a missing order', async () => {
    const order = await createOrder(10000);
    await payment(order.id, '0', `invalid-${order.id}`).expect(400);
    await payment('20000000-0000-4000-8000-000000000099', '10.00', 'missing-order-key').expect(404);
  });

  it('returns a summary consistent with independent database aggregates', async () => {
    const order = await createOrder(10000);
    await payment(order.id, '120.00', `report-${order.id}`).expect(201);
    const response = await request(app.getHttpServer()).get('/api/reports/summary').expect(200);
    const expected = await dataSource.query(`
      SELECT SUM(o.amount_kopecks)::bigint AS amount,
             SUM(COALESCE(p.paid, 0))::bigint AS paid,
             SUM(GREATEST(o.amount_kopecks - COALESCE(p.paid, 0), 0))::bigint AS remaining,
             SUM(GREATEST(COALESCE(p.paid, 0) - o.amount_kopecks, 0))::bigint AS overpayment
      FROM orders o LEFT JOIN (SELECT order_id, SUM(amount_kopecks) paid FROM payments GROUP BY order_id) p ON p.order_id = o.id
    `);
    expect(response.body.totals).toMatchObject({
      amount: (Number(expected[0].amount) / 100).toFixed(2),
      paid: (Number(expected[0].paid) / 100).toFixed(2),
      remaining: (Number(expected[0].remaining) / 100).toFixed(2),
      overpayment: (Number(expected[0].overpayment) / 100).toFixed(2),
    });
  });
});
