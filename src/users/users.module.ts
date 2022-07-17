import {forwardRef, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './users.entity';
import {Role} from 'src/roles/roles.entity';
import {AuthModule} from 'src/auth/auth.module';
import {RolesModule} from 'src/roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), forwardRef(() => AuthModule), RolesModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
