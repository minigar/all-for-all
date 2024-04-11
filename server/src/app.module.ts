import { Module } from '@nestjs/common';
import { AccessTokenStrategy, RefreshTokenStrategy } from './auth/strategies';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards';
import { DatabaseModule } from './data/database.module';
import { ControllersModule } from './controllers/controllers.module';
import { ServiceModule } from './services/services.module';

@Module({
  imports: [
    DatabaseModule,
    ControllersModule,
    ServiceModule,
  ],
  controllers: [],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule { }
