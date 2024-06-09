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
    @Body() body: { totalAmout: number; email: string; gameIds: string[] },
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const email = request['user'].email;
    const { totalAmout, gameIds } = body;
    return this.paymentService.initializePaymentGameTitle(
      totalAmout,
      email,
      gameIds,
    );
  }

  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  @Post('webhook')
  async handleWebhook(@Req() request: Request) {
    const payload = request.body;
    await this.paymentService.handleWebhook(payload);
  }
}
