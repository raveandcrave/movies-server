import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

import {UsersService} from 'src/users/users.service';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {RegisterUserDto} from 'src/users/dto/register-user.dto';
import {GetUserDto} from 'src/users/dto/get-user.dto';
import {Token} from './tokens.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Token)
    private tokensRepostory: Repository<Token>
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);

    const userDto = new GetUserDto(user);
    const tokens = this.generateTokens({...userDto});
    await this.saveToken(user.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async registration(dto: RegisterUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userService.createUser({...dto, password: hashPassword});

    const userDto = new GetUserDto(user);
    const tokens = this.generateTokens({...userDto});
    await this.saveToken(user.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  async logout(refreshToken) {
    this.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const userData = this.validateRefreshToken(refreshToken);
    const tokenFromDb = this.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getUserById(userData.id);

    const userDto = new GetUserDto(user);
    const tokens = this.generateTokens({...userDto});
    await this.saveToken(user.id, tokens.refreshToken);

    return {...tokens, user: userDto};
  }

  private generateTokens(user: GetUserDto) {
    const payload = {email: user.email, id: user.id, roles: user.roles};

    const accessToken = this.jwtService.sign(payload, {secret: process.env.JWT_SECRET, expiresIn: '15m'});
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

  private async removeToken(refreshToken) {
    await this.tokensRepostory.delete({refreshToken});
  }

  private async findToken(refreshToken) {
    const tokenData = this.tokensRepostory.findOneBy({refreshToken});
    return tokenData;
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(userDto.password, user.password);

    if (user && passwordEquals) {
      return user;
    }

    throw new UnauthorizedException({message: 'Некорректный email или пароль'});
  }

  validateAccessToken(token) {
    try {
      const userData = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
      return userData;
    } catch (e) {
      return null;
    }
  }

  private validateRefreshToken(token) {
    try {
      const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET});
      return userData;
    } catch (e) {
      return null;
    }
  }
}
