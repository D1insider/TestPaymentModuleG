import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource, private readonly redis: RedisService) {}

  @Get()
  async check() {
    const result = { application: 'ok', postgres: 'down', redis: 'down' };
    try {
      await this.dataSource.query('SELECT 1');
      result.postgres = 'ok';
    } catch {}
    try {
      if ((await this.redis.ping()) === 'PONG') result.redis = 'ok';
    } catch {}
    if (result.postgres !== 'ok' || result.redis !== 'ok') {
      throw new ServiceUnavailableException({ message: 'Зависимости приложения недоступны', ...result });
    }
    return result;
  }
}
