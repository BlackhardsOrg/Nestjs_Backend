import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private connection: Connection) {
    if (connection) {
      console.log('DB connected successfully!');
    }
  }

  Test(): string {
    return 'Server Connected!';
  }
}
