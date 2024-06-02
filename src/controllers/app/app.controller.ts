import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from '../../providers/services/app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  default(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): { name: string } {
    const responseData = this.appService.Test();
    response.statusCode = 400;
    return { name: responseData };
  }
}
