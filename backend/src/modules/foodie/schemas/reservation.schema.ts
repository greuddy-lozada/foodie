import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReservationDocument = Reservation & Document;

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum ReservationType {
  TABLE = 'table',
  RESTAURANT = 'restaurant',
}

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  customerName: string;

  @Prop({ required: true })
  customerPhone: string;

  @Prop()
  customerEmail?: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  numberOfPeople: number;

  @Prop({ required: true, enum: ReservationType, default: ReservationType.TABLE })
  type: ReservationType;

  @Prop()
  tableNumber?: string;

  @Prop({ type: Types.ObjectId, ref: 'Order' })
  orderId?: Types.ObjectId;

  @Prop({ required: true, enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @Prop()
  notes?: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
ReservationSchema.index({ tenantId: 1, date: 1 });
