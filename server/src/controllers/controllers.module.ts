import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../data/database.module';
import { UserController } from './user.controller';
import { ServiceModule } from 'src/services/services.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigModule, DatabaseModule, ServiceModule],
  controllers: [UserController, AuthController],
})
export class ControllersModule { }
