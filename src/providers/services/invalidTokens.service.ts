// invalidated-token.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvalidTokens } from 'src/models/InvalidTokens.model';

@Injectable()
export class InvalidTokenService {
  constructor(
    @InjectModel(InvalidTokens.name)
    private readonly invalidatedTokenModel: Model<InvalidTokens>,
  ) {}

  async addInvalidatedToken(token: string): Promise<void> {
    const invalidatedToken = new this.invalidatedTokenModel({ token });
    await invalidatedToken.save();
  }

  async isTokenInvalid(token: string): Promise<boolean> {
    return !!(await this.invalidatedTokenModel.findOne({ token }).exec());
  }
}
