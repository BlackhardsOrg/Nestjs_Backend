import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  IGameTitleRequestData,
  IMessageResponse,
  IUserRegisterRequestData,
} from 'src/interfaces';
import { GameTitle } from 'src/models/gametitle.model';
import { MessageHelper } from 'src/providers/helpers/messages.helpers';
import { GameTitleService } from 'src/providers/services/gameTitle.service';

@Controller('gametitle')
export class GametitleController {
  constructor(
    private readonly gameTitleService: GameTitleService,
    private readonly messageHelper: MessageHelper,
  ) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createGameTitle(
    @Body() gameData: IGameTitleRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.createGameTitle(gameData);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Put('update')
  async updateGameTitle(
    @Body() gameData: IGameTitleRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.createGameTitle(gameData);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Delete('delete')
  async deleteGameTitle(
    @Body() gameData: IGameTitleRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.createGameTitle(gameData);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('fetch/:id')
  async fetchGameTitle(
    @Body() gameData: IGameTitleRequestData,
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<GameTitle>> {
    try {
      const responseData = await this.gameTitleService.fetchGameTitle(id);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('user/games')
  async fetchUserGameTitles(
    @Body('developerEmail') developerEmail: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<GameTitle[]>> {
    try {
      const responseData =
        await this.gameTitleService.fetchUserGameTitles(developerEmail);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('games/all')
  async fetchAllGameTitles(
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<GameTitle[]>> {
    try {
      const responseData = await this.gameTitleService.fetchAllGameTitles();
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('approve')
  async approveGameTitle(
    @Body('gameTitleId') gameTitleId: string,

    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.approveGameTitle(gameTitleId);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('disapprove')
  async disApproveGameTitle(
    @Body('gameTitleId') gameTitleId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.disApproveGameTitle(gameTitleId);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('list')
  async listGameTitle(
    @Body('gameTitleId') gameTitleId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.listGameTitle(gameTitleId);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }

  @Post('unlist')
  async unListGameTitle(
    @Body('gameTitleId') gameTitleId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData =
        await this.gameTitleService.unListGameTitle(gameTitleId);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      console.log(err.message, 'ERROR');
      response.statusCode = err.statusCode || 400;
      return this.messageHelper.ErrorResponse(err.message);
    }
  }
}
