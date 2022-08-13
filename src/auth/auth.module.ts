import {forwardRef, Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersModule} from 'src/users/users.module';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {Token} from './tokens.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || 'SECRET',
    }),
    TypeOrmModule.forFeature([Token]),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
