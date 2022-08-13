import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {UsersService} from 'src/users/users.service';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {User} from 'src/users/users.entity';
import {Token} from './tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokensRepostory: Repository<Token>
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);

    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({...userDto, password: hashPassword});

    const tokens = this.generateToken(user);
    await this.saveToken(user.id, tokens.refreshToken);

    return {...tokens, user};
  }

  private generateToken(user: User) {
    const payload = {email: user.email, id: user.id, roles: user.roles};

    const accessToken = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: '30m'});
    const refreshToken = this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d'});

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveToken(userId, refreshToken) {
    const tokenData = await this.tokensRepostory.findOneBy({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await this.tokensRepostory.save(tokenData);
    }

    const token = await this.tokensRepostory.insert({user: userId, refreshToken});

    return token;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({message: 'Некорректный email или пароль'});
  }
}
