import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  IAuctionGameTitleRequest,
  IAuctionsReponseData,
  IAuctionsRequestData,
  IMessageResponse,
} from 'src/interfaces';
import { Response, Request } from 'express';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { AuctionsService } from 'src/providers/services/auctions.service';
import { AuthGuard } from '../../guards/auth.guard';
import { GameTitle } from 'src/models/gametitle.model';
import { Auction } from 'src/models/auction.model';
import { PaymentService } from 'src/providers/services/payment.service';
import { GameTitleService } from 'src/providers/services/gameTitle.service';

@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionService: AuctionsService,
    private readonly gameTitleService: GameTitleService,

    private readonly paymentService: PaymentService,
    private readonly messageHelper: MessageHelper,
  ) {}

  // fetch auction
  @UseGuards(AuthGuard)
  @Post('start')
  async startAuction(
    @Body() auctionsGameTitleData: IAuctionGameTitleRequest,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<{ auctionId: string } | null>> {
    try {
      const sellerEmail = request['user'].email;
      console.log('WHOOOO!!!', auctionsGameTitleData);
      if (
        //!auctionsGameTitleData.gameTitleId ||
        !auctionsGameTitleData.endTime ||
        !auctionsGameTitleData.reservedPrice ||
        !auctionsGameTitleData.startTime
      )
        throw new BadRequestException('Invalid Inputs');

      const gametitleData = await this.gameTitleService.createAuctionGameTitle({
        ...auctionsGameTitleData,
        developerEmail: sellerEmail,
      });
      if (!gametitleData.success)
        throw new UnauthorizedException('Game Title  Creation not successful!');
      const responseData = await this.auctionService.startAuction(
        {
          ...auctionsGameTitleData,
          gameTitleId: gametitleData.data.gameTitleId,
        },
        sellerEmail,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @Put('update')
  async updateAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const sellerEmail = request['user'].email;

      if (!auctionsData.gameTitleId || !auctionsData.endTime)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.updateAuction(
        sellerEmail,
        auctionsData,
        auctionsData.auctionId,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // end auction

  @UseGuards(AuthGuard)
  @Post('end')
  async endAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      const sellerEmail = request['user'].email;

      if (!auctionsData.auctionId)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.endAuction(
        auctionsData.auctionId,
        sellerEmail,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // fetch auction
  @UseGuards(AuthGuard)
  @Post('placebid')
  async placeBidOnAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<IAuctionsReponseData | null>> {
    try {
      const { bidAmountToPlace } = auctionsData;
      const bidderEmail = request['user'].email;

      if (!auctionsData.auctionId)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.placeBidOnAuction(
        auctionsData.auctionId,
        bidderEmail,
        bidAmountToPlace,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // result auction
  @UseGuards(AuthGuard)
  @Post('result')
  async resultAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const resulterEmail = request['user'].email;
      if (!auctionsData.auctionId)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.resultAuction(
        auctionsData.auctionId,
        resulterEmail,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // confirm  auction
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
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // fetch auction
  @Get('fetch')
  async fetchAuction(
    @Body() auctionsData: IAuctionsRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<Auction | null>> {
    try {
      if (!auctionsData.auctionId)
        throw new BadRequestException('Invalid Inputs');
      const responseData = await this.auctionService.fetchAuction(
        auctionsData.auctionId,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // fetch all auctions
  @Get('fetch/all')
  async fetchAllAuctions(
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<Auction[] | null>> {
    try {
      const responseData = await this.auctionService.fetchAllAuctions();
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  // fetch auction
  @Get('minimumbid/bid')
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
      return this.messageHelper.ErrorResponse(err, response);
    }
  }
}
