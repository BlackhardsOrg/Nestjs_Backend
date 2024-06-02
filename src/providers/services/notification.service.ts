import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async notify(
    senderId: string,
    receiverId: string,
    reason: string,
    amount: number,
    type: string,
  ): Promise<string> {
    // Create a transaction record
    const transaction = new this.notificationModel({
      receiverId,
      senderId,
      reason,
      amount,
      type,
      createdAt: new Date().getDate(),
    });
    await transaction.save();

    return 'Credit transfer successful!';
  }
}
