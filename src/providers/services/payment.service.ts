import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  private readonly paystackInnitializeURL =
    process.env.PAYSTACK_INNITIALIZE_URL;

  private readonly paystackVerifyURL = process.env.PAYSTACK_VERIFY_URL;

  async initializePayment(amount: number, email: string): Promise<any> {
    const url = this.paystackInnitializeURL;
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };
    const data = {
      amount: amount * 100, // Paystack expects amount in kobo
      email,
      callback_url: 'http://localhost:3000/payment/confirm',
    };

    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      console.log(error, 'CHECK');
      throw new HttpException(
        error.response.data.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPayment(reference: string): Promise<any> {
    console.log(reference, 'REF');
    const url = `${this.paystackVerifyURL}/${reference}`;
    const headers = {
      Authorization: `Bearer ${this.paystackSecretKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
