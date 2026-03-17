import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';

@Injectable()
export class KdsService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async getActiveOrders(tenantId: string) {
    return this.orderModel.find({
      tenantId,
      status: { $in: [OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY] }
    }).sort({ createdAt: 1 }).exec();
  }

  async updateOrderStatus(tenantId: string, orderId: string, status: OrderStatus) {
    const order = await this.orderModel.findOneAndUpdate(
      { _id: orderId, tenantId },
      { $set: { status } },
      { new: true }
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
