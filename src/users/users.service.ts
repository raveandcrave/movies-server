import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Role} from 'src/roles/roles.entity';
import {RolesService} from 'src/roles/roles.service';
import {Repository} from 'typeorm';
import {AddRoleDto} from './dto/add-role.dto';
import {BanUserDto} from './dto/ban-user.dto';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const role = await this.rolesRepository.findOneBy({value: 'USER'});
      const user = this.usersRepository.create({...dto, roles: [role]});
      return await this.usersRepository.save(user);
    } catch (e) {
      console.error(e);
    }
  }

  async getAllUsers() {
    try {
      const users = await this.usersRepository.find();
      return users;
    } catch (e) {
      console.error(e);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({email});
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async addRole(dto: AddRoleDto) {
    try {
      const user = await this.usersRepository.findOneBy({id: dto.userId});
      const role = await this.rolesService.getRoleByValue(dto.value);
      if (role && user) {
        const existingRole = user.roles.find((r) => r.id === role.id);
        if (existingRole) {
          throw new HttpException('У пользователя уже есть данная роль', HttpStatus.BAD_REQUEST);
        }
        user.roles.push(role);
        await this.usersRepository.save(user);
        return user;
      }
      throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    } catch (err) {
      console.error(err);
    }
  }

  async ban(dto: BanUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({id: dto.userId});
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }
      user.banned = true;
      user.banReason = dto.banReason;
      await this.usersRepository.save(user);
      return user;
    } catch (err) {
      console.error(err);
    }
  }
}
