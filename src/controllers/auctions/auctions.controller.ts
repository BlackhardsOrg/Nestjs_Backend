import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  IAuctionsReponseData,
  IAuctionsRequestData,
  IMessageResponse,
} from 'src/interfaces';
import { Response, Request } from 'express';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { AuctionsService } from 'src/providers/services/auctions.service';
import { AuthGuard } from '../../guards/auth.guard';
import { GameTitle } from 'src/models/gametitle.model';

@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionService: AuctionsService,
    private readonly messageHelper: MessageHelper,
  ) {}

  // fetch auction
  @UseGuards(AuthGuard)
  @Post('start')
  async startAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<{ auctionId: string } | null>> {
    try {
      const sellerEmail = request['user'].email;

      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.startAuction(
        request,
        sellerEmail,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  // fetch auction
  @Post('end')
  async endAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      const sellerEmail = request['user'].email;

      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.endAuction(
        auctionsData.auctionId,
        request,
        sellerEmail,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  // fetch auction
  @Post('placebid')
  async placeBidOnAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      const { bidAmountToPlace } = auctionsData;
      const bidderEmail = request['user'].email;

      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.placeBidOnAuction(
        auctionsData.auctionId,
        request,
        bidderEmail,
        bidAmountToPlace,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  // fetch auction
  @Post('result')
  async resultAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.resultAuction(
        auctionsData.auctionId,
        request,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  // fetch auction
  @Post('confirm')
  async confirmAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      const bidderEmail = request['user'].email;
      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.confirmAuction(
        auctionsData.auctionId,
        request,
        bidderEmail,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  // fetch auction
  @Get('fetch')
  async fetchAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<GameTitle | null>> {
    try {
      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.fetchAuction(
        auctionsData.auctionId,
        request,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  // fetch auction
  @Get('minimumbid')
  async fetchMinimumBid(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.fetchMinimumBid(
        auctionsData.auctionId,
        request,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err, 'ERR');
      response.statusCode = err.statusCode ? err.statusCode : 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }
}
