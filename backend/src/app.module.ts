import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './core/auth/auth.module';
import { TenantMiddleware } from './core/tenant/tenant.middleware';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { AdminModule } from './core/admin/admin.module';
import configurations from './core/config/configurations';
import { DatabaseConfig } from './core/config/config.types';
import { BootstrapModule } from './core/bootstrap/bootstrap.module';
import { TenantModule } from './core/tenant/tenant.module';
import { envValidationSchema } from './core/config/env.validation';
import { SubscriptionModule } from './core/subscription/subscription.module';
import { FoodieModule } from './modules/foodie/foodie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<{ database: DatabaseConfig }>,
      ) => ({
        uri: configService.get<string>('database.uri', { infer: true })!,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    AdminModule,
    BootstrapModule,
    TenantModule,
    SubscriptionModule,
    FoodieModule,
  ],

  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .exclude(
        'tenants/*path',
        'subscriptions/webhook',
        'subscriptions/binance',
      )

      .forRoutes('*');
  }
}
