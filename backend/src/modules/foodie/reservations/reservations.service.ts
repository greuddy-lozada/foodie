import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reservation, ReservationDocument, ReservationStatus } from '../schemas/reservation.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { PosService } from '../pos/pos.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private posService: PosService,
  ) {}

  async createReservation(tenantId: string, data: any) {
    let orderId: Types.ObjectId | null = null;

    if (data.order && data.order.items && data.order.items.length > 0) {
      const order = await this.posService.createOrder(tenantId, data.order.items);
      orderId = order._id;
    }

    const reservation = new this.reservationModel({
      tenantId,
      ...data,
      orderId,
      status: ReservationStatus.PENDING,
    });

    return reservation.save();
  }

  async getReservations(tenantId: string) {
    return this.reservationModel.find({ tenantId }).populate('orderId').exec();
  }

  async updateReservationStatus(tenantId: string, id: string, status: ReservationStatus) {
    const reservation = await this.reservationModel.findOneAndUpdate(
      { _id: id, tenantId },
      { status },
      { new: true }
    ).exec();

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async deleteReservation(tenantId: string, id: string) {
    const result = await this.reservationModel.deleteOne({ _id: id, tenantId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Reservation not found');
    }
    return { success: true };
  }
}
