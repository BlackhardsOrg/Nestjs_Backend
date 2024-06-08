import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'src/models/notification.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async notify(
    senderId: string,
    receiverId: string,
    targetId: string,
    reason: string,
    amount: number,
    type: string,
  ): Promise<string> {
    // Create a transaction record
    const transaction = new this.notificationModel({
      id: uuidv4(),
      receiverId,
      senderId,
      reason,
      targetId,
      amount,
      type,
      createdAt: new Date().getDate(),
    });
    await transaction.save();

    return 'Credit transfer successful!';
  }
}
