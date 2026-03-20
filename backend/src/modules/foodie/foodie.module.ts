import { Module } from '@nestjs/common';
import { AuthModule } from '../../core/auth/auth.module';
import { TenantModule } from '../../core/tenant/tenant.module';
import { PosModule } from './pos/pos.module';
import { KdsModule } from './kds/kds.module';
import { InventoryModule } from './inventory/inventory.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    PosModule,
    KdsModule,
    InventoryModule,
    ReservationsModule,
  ],
  controllers: [],
  providers: [],
})
export class FoodieModule {}
