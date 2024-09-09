import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response, response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { IOrder } from 'src/interfaces';
import { PaymentService } from 'src/providers/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post('initialize/auction')
  async initializePaymentAuction(
    @Body() body: { auctionId: string },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const email = request['user'].email;
    const { auctionId } = body;
    return this.paymentService.initializePaymentGameAuction(email, auctionId);
  }

  @UseGuards(AuthGuard)
  @Post('initialize/fixed')
  async initializePaymentFixed(
    @Body()
    body: IOrder,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const email = request['user'].email;

    const {
      totalAmount,
      GamePackageAndIds,
      firstName,
      lastName,
      companyName,
      country,
      houseNo,
      streetName,
      town,
      state,
      zip,
      phone,
      additionalInfo,
      paymentType,
    } = body;

    return this.paymentService.initializePaymentGameTitle({
      totalAmount,
      email,
      GamePackageAndIds,
      firstName,
      lastName,
      companyName,
      country,
      houseNo,
      streetName,
      town,
      state,
      zip,
      phone,
      additionalInfo,
      paymentType,
    });
  }

  @Get('verify/:reference')
  async verifyPayment(
    @Param('reference') reference: string,
    @Query('orderRef') orderReference: string,
  ) {
    return this.paymentService.verifyPayment(reference, orderReference);
  }

  @Get('paystack/order/:reference')
  async fetchPaystackOrder(@Param('reference') reference: string) {
    return this.paymentService.fetchPaystackOrder(reference);
  }

  @Post('webhook')
  async handleWebhook(@Req() request: Request) {
    const payload = request.body;
    await this.paymentService.handleWebhook(payload);
  }
}
