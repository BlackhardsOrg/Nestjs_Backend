import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @Put('update')
  async updateGameTitle(
    @Body() gameData: IGameTitleRequestData,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData = await this.gameTitleService.updateGameTitle(
        gameData.id,
        gameData,
      );
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteGameTitle(
    @Body('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<boolean>> {
    try {
      const responseData = await this.gameTitleService.deleteGameTitle(id);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @Get('fetch/:id')
  async fetchGameTitle(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<GameTitle>> {
    try {
      const responseData = await this.gameTitleService.fetchGameTitle(id);
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
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
      return this.messageHelper.ErrorResponse(err, response);
    }
  }

  @Get('games/all')
  async fetchAllGameTitles(
    @Res({ passthrough: true }) response: Response,
  ): Promise<IMessageResponse<GameTitle[]>> {
    try {
      const responseData = await this.gameTitleService.fetchAllGameTitles();
      response.statusCode = responseData.statusCode;
      return responseData;
    } catch (err) {
      return this.messageHelper.ErrorResponse(err, response);
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
      return this.messageHelper.ErrorResponse(err, response);
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
      return this.messageHelper.ErrorResponse(err, response);
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
      return this.messageHelper.ErrorResponse(err, response);
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
      return this.messageHelper.ErrorResponse(err, response);
    }
  }
}
