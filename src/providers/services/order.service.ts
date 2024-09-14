import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrder } from 'src/interfaces';
import { Order } from 'src/models/orders.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createOrder({
    totalAmount,
    email,
    GamePackageAndIds,
    firstName,
    lastName,
    companyName,
    country,
    houseNo,
    streetName,
    town,
    state,
    zip,
    phone,
    additionalInfo,
    paymentType,
  }: IOrder): Promise<{ orderID: string; _id: string }> {
    // Create a Order record
    const newOrderID = uuidv4();
    const order = new this.orderModel({
      id: newOrderID,
      totalAmount,
      email,
      GamePackageAndIds,
      firstName,
      lastName,
      companyName,
      country,
      houseNo,
      streetName,
      town,
      state,
      zip,
      phone,
      additionalInfo,
      paymentType,
    });
    await order.save();

    return { orderID: newOrderID, _id: order._id };
  }

  async fulfilOrder({
    orderID,
    payStackOrderReference,
  }: {
    orderID: string;
    payStackOrderReference: string;
  }): Promise<boolean> {
    // Create a transaction record

    let success = false;
    const order = await this.orderModel.findOne({ id: orderID });
    if (!order) throw new NotFoundException('order not found');
    order.isFulfilled = true;
    order.payStackOrderReference = payStackOrderReference;

    await order.save();
    success = true;
    return success;
  }

  async fulfilOrderCrypto({
    orderID,
    txnHash,
  }: {
    orderID: string;
    txnHash: string;
  }): Promise<boolean> {
    // Create a transaction record

    let success = false;
    const order = await this.orderModel.findOne({ id: orderID });
    if (!order) throw new NotFoundException('order not found');
    order.isFulfilled = true;
    order.transactionHash = txnHash;

    console.log(order, 'ORDE');
    await order.save();
    success = true;
    return success;
  }

  async fetchAllOrders(): Promise<IOrder[]> {
    // Create a transaction record
    const orders = await this.orderModel.find();
    return orders;
  }

  async fetchUserOrders({ email }: { email: string }): Promise<IOrder[]> {
    // Create a transaction record
    const orders = await this.orderModel.find({ email: email });
    return orders;
  }

  async fetchOrder({ orderID }: { orderID: string }): Promise<IOrder> {
    // Create a transaction record
    const order = await this.orderModel.findOne({ id: orderID });
    return order;
  }
}
