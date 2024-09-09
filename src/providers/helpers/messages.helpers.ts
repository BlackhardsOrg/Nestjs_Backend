import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Response } from 'express';
import { Connection } from 'mongoose';
import { IMessageResponse, IUserRegisterResponseData } from 'src/interfaces';

@Injectable()
export class MessageHelper {
  constructor(@InjectConnection() private connection: Connection) {}

  SuccessResponse<T>(
    message: string,
    data: T,
    statusCode: number = 200,
  ): IMessageResponse<T> {
    return { success: true, message: message, data, statusCode };
  }

  ErrorResponse<T>(err: any, response: Response): IMessageResponse<T> {
    let errMessage = err.message;
    let statusCode = err.statusCode ? err.statusCode : 400;

    if (err.response) {
      errMessage = err.response.message;
      statusCode = err.response.statusCode ? err.response.statusCode : 400;
    }
    response.statusCode = statusCode;
    return { success: false, message: errMessage, data: null, statusCode };
  }
}
