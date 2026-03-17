import { Controller, Get, Post, Body } from '@nestjs/common';
import { PosService } from './pos.service';
import { TenantContext } from '../../../core/auth/decorators/tenant-context.decorator';
import { TenantContextDto } from '../../../core/auth/dto';

@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('products')
  async createProduct(@TenantContext() context: TenantContextDto, @Body() data: any) {
    return this.posService.createProduct(context.tenantId, data);
  }

  @Get('products')
  async getProducts(@TenantContext() context: TenantContextDto) {
    return this.posService.getProducts(context.tenantId);
  }

  @Post('orders')
  async createOrder(
    @TenantContext() context: TenantContextDto,
    @Body() data: { items: { productId: string; quantity: number; notes?: string }[] }
  ) {
    return this.posService.createOrder(context.tenantId, data.items);
  }
}
