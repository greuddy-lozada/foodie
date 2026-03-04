import { Module } from '@nestjs/common';
import { AuthModule } from '../../core/auth/auth.module';
import { TenantModule } from '../../core/tenant/tenant.module';

@Module({
  imports: [
    AuthModule,
    TenantModule,
    // Future sub-modules will be added here:
    // PosModule,
    // KdsModule,
    // InventoryModule,
  ],
  controllers: [],
  providers: [],
})
export class FoodieModule {}
