import {Module} from '@nestjs/common';
import {RolesService} from './roles.service';
import {RolesController} from './roles.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Role} from './roles.entity';
import {User} from 'src/users/users.entity';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([Role, User])],
})
export class RolesModule {}
