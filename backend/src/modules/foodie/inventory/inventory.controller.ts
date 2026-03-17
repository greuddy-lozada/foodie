import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TenantContext } from '../../../core/auth/decorators/tenant-context.decorator';
import { TenantContextDto } from '../../../core/auth/dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async createItem(@TenantContext() context: TenantContextDto, @Body() dto: { name: string; stock: number; unit: string }) {
    return this.inventoryService.create(context.tenantId, dto.name, dto.stock, dto.unit);
  }

  @Get()
  async getItems(@TenantContext() context: TenantContextDto) {
    return this.inventoryService.findAll(context.tenantId);
  }
}
