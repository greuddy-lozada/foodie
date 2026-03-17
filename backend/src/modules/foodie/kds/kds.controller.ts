import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { KdsService } from './kds.service';
import { TenantContext } from '../../../core/auth/decorators/tenant-context.decorator';
import { TenantContextDto } from '../../../core/auth/dto';
import { OrderStatus } from '../schemas/order.schema';

@Controller('kds')
export class KdsController {
  constructor(private readonly kdsService: KdsService) {}

  @Get('orders')
  async getActiveOrders(@TenantContext() context: TenantContextDto) {
    return this.kdsService.getActiveOrders(context.tenantId);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @TenantContext() context: TenantContextDto,
    @Param('id') id: string,
    @Body('status') status: OrderStatus
  ) {
    return this.kdsService.updateOrderStatus(context.tenantId, id, status);
  }
}
