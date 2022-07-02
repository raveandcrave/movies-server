import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.usersRepository.save(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }
}
