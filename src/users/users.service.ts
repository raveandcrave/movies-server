import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Role} from 'src/roles/roles.entity';
import {Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
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
}
