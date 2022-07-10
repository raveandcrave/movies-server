import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateRoleDto} from './dto/create-role.dto';
import {Role} from './roles.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private rolesRepository: Repository<Role>) {}

  async createRole(dto: CreateRoleDto) {
    try {
      const role = await this.rolesRepository.insert(dto);
      console.log(role);
      return role;
    } catch (e) {
      console.error(e);
    }
  }

  async getRoleByValue(value: string) {
    try {
      const role = await this.rolesRepository.findOne({where: {value}});
      return role;
    } catch (e) {
      console.error(e);
    }
  }
}
