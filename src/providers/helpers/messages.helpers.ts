import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
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

  ErrorResponse<T>(message: string, statusCode = 400): IMessageResponse<T> {
    return { success: false, message: message, data: null, statusCode };
  }
}
