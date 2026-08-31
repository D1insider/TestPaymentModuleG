import { Body, Controller, HttpCode, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

@Controller('orders/:orderId/payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @Body() dto: CreatePaymentDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.payments.create(orderId, dto);
    response.status(result.created ? 201 : 200);
    return result;
  }
}
