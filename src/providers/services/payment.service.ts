import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Auction } from 'src/models/auction.model';
import { GameTitle } from 'src/models/gametitle.model';
import { HighestBidder } from 'src/models/highestBidder.model';
import { GameTitleService } from './gameTitle.service';
import { User } from 'src/models/user.model';

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
  private readonly paystackInnitializeURL =
    process.env.PAYSTACK_INNITIALIZE_URL;

  private readonly paystackVerifyURL = process.env.PAYSTACK_VERIFY_URL;
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(GameTitle.name) private gameTitleModel: Model<GameTitle>,
    @InjectModel(User.name) private userModel: Model<User>,

    @InjectModel(HighestBidder.name)
    private highestBidderModel: Model<HighestBidder>,
    private readonly gameService: GameTitleService,
  ) {}
  async initializePaymentGameTitle(
    totalAmount: number,
    email: string,
    gameIds: string[],
  ): Promise<any> {
    try {
      const games = await this.gameService.findGamesByIds(gameIds);
      const totalPrice = games.reduce((sum, game) => sum + game.price, 0);

      if (totalPrice !== totalAmount) {
        throw new HttpException(
          'Amount does not match total price of selected games',
          HttpStatus.BAD_REQUEST,
        );
      }

      const metadata = {
        saleType: 'fixed',
        custom_fields: games.map((game) => ({
          display_name: game.title,
          variable_name: game._id,
          value: `Game ID: ${game._id}, Price: ${game.price}, Title: ${game.title}`,
        })),
      };

      const url = this.paystackInnitializeURL;
      const headers = {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      };
      const data = {
        amount: totalAmount * 100,
        email,
        callback_url: 'http://localhost:3000/payment/confirm',
        metadata: metadata,
      };

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

  async initializePaymentGameAuction(
    email: string,
    auctionId: string,
  ): Promise<any> {
    try {
      let amount: number = 0;
      const auction = await this.auctionModel.findById(auctionId);
      const highestBidder = await this.highestBidderModel.findOne({
        auctionId,
      });

      if (email != highestBidder.bidderEmail)
        throw new UnauthorizedException(
          'You are not the Highest bidder & this auction winner',
        );

      amount = highestBidder.bid;
      const gameTitle = await this.gameTitleModel.findById(auction.gameTitleId);

      const url = this.paystackInnitializeURL;
      const headers = {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      };
      const data = {
        amount: amount * 100,
        email,
        callback_url: 'http://localhost:3000/payment/confirm',
        metadata: {
          auctionId,
          gameTitleId: gameTitle._id,
          highestBid: amount,
          gameTitle: gameTitle.title,
          Description: gameTitle.description,
          saleType: 'Auction',
        },
      };
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
    try {
      console.log(reference, 'REF');
      const url = `${this.paystackVerifyURL}/${reference}`;
      const headers = {
        Authorization: `Bearer ${this.paystackSecretKey}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.get(url, { headers });

      const { data } = response.data;

      if (data.status === 'success') {
        await this.handleSuccessfulPayment(data);
      }

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response.data.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async handleSuccessfulPayment(data: any): Promise<void> {
    const { metadata, customer, amount, receipt_number, reference } = data;

    if (metadata.saleType === 'fixed') {
      await this.addGamesToUserInventory(
        customer.email,
        metadata.custom_fields,
      );
    } else if (metadata.saleType === 'Auction') {
      await this.confirmAuctionPurchase(
        customer.email,
        metadata.auctionId,
        amount / 100, // converting back from kobo to the main currency unit

        receipt_number,
        reference,
      );
    }
  }

  async addGamesToUserInventory(
    email: string,
    customFields: any[],
  ): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const gameIds = customFields.map((field) => field.variable_name);

    user.inventory.push(...gameIds);
    await user.save();
  }

  async confirmAuctionPurchase(
    email: string,
    auctionId: string,
    amount: number,
    receipt_number: string,
    reference: string,
  ): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.balance += amount;
    await user.save();

    const auction = await this.auctionModel.findById(auctionId);
    if (auction) {
      auction.paymentInfo.hasBuyerPaid = true;
      auction.paymentInfo.paymentReceipt = receipt_number;
      auction.paymentInfo.reference = reference;

      await auction.save();
    }
  }

  async handleWebhook(data: any): Promise<void> {
    const { event, data: eventData } = data;
    if (event === 'charge.success') {
      await this.handleSuccessfulPayment(eventData);
    }
  }
}
