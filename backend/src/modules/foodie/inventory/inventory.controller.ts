import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TenantContext } from '../../../core/auth/decorators/tenant-context.decorator';
import { TenantContextDto } from '../../../core/auth/dto';
import { Public } from '../../../core/auth/decorators/public.decorator';

@Public()
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
  @Patch(':id')
  async updateItem(
    @TenantContext() context: TenantContextDto,
    @Param('id') id: string,
    @Body() dto: { stock?: number; outOfStock?: boolean; name?: string; unit?: string }
  ) {
    const { outOfStock, ...updates } = dto;
    return this.inventoryService.update(context.tenantId, id, updates as any);
  }
}
