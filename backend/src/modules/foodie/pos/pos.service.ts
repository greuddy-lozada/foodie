import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Order, OrderDocument, OrderStatus } from '../schemas/order.schema';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class PosService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private inventoryService: InventoryService,
  ) {}

  async createProduct(tenantId: string, data: any) {
    const product = new this.productModel({ tenantId, ...data });
    return product.save();
  }

  async getProducts(tenantId: string) {
    return this.productModel.find({ tenantId }).exec();
  }

  async createOrder(tenantId: string, items: { productId: string; quantity: number; notes?: string }[]) {
    const productIds = items.map((item) => item.productId);
    const products = await this.productModel.find({ _id: { $in: productIds }, tenantId }).exec();

    if (products.length !== productIds.length) {
      throw new NotFoundException('Some products were not found');
    }

    let total = 0;
    const inventoryUpdates: { ingredientId: any; quantity: number }[] = [];

    const orderItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) throw new NotFoundException('Product not found');

      total += product.price * item.quantity;

      for (const ing of product.ingredients) {
        inventoryUpdates.push({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity * item.quantity,
        });
      }

      return {
        productId: product._id,
        quantity: item.quantity,
        notes: item.notes,
        name: product.name,
        price: product.price,
      };
    });

    const order = new this.orderModel({
      tenantId,
      items: orderItems,
      total,
      status: OrderStatus.PENDING,
    });

    await order.save();

    if (inventoryUpdates.length > 0) {
      await this.inventoryService.decrementStock(tenantId, inventoryUpdates);
    }

    return order;
  }
}
