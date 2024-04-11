import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../data/database.module';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, DatabaseModule, JwtModule.register({})],
  providers: [UserService, AuthService],
  exports: [UserService, AuthService],
})
export class ServiceModule { }
