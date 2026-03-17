import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ _id: false })
export class ProductIngredient {
  @Prop({ type: Types.ObjectId, ref: 'InventoryItem', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ required: true, default: 1 })
  quantity: number;
}
export const ProductIngredientSchema = SchemaFactory.createForClass(ProductIngredient);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, index: true })
  tenantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [ProductIngredientSchema], default: [] })
  ingredients: ProductIngredient[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ tenantId: 1, name: 1 }, { unique: true });
