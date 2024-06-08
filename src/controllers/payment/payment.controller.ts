import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { PaymentService } from 'src/providers/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  async initializePayment(@Body() body: { amount: number; email: string }) {
    const { amount, email } = body;
    return this.paymentService.initializePayment(amount, email);
  }

  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }
}
