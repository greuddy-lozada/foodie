import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { TenantContext } from '../../../core/auth/decorators/tenant-context.decorator';
import { TenantContextDto } from '../../../core/auth/dto';
import { ReservationStatus } from '../schemas/reservation.schema';
import { Public } from '../../../core/auth/decorators/public.decorator';

@Public()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async createReservation(
    @TenantContext() context: TenantContextDto,
    @Body() data: any
  ) {
    return this.reservationsService.createReservation(context.tenantId, data);
  }

  @Get()
  async getReservations(@TenantContext() context: TenantContextDto) {
    return this.reservationsService.getReservations(context.tenantId);
  }

  @Patch(':id/status')
  async updateStatus(
    @TenantContext() context: TenantContextDto,
    @Param('id') id: string,
    @Body('status') status: ReservationStatus
  ) {
    return this.reservationsService.updateReservationStatus(context.tenantId, id, status);
  }

  @Delete(':id')
  async deleteReservation(
    @TenantContext() context: TenantContextDto,
    @Param('id') id: string
  ) {
    return this.reservationsService.deleteReservation(context.tenantId, id);
  }
}
