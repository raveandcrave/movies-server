import {Body, Controller, Post, Res} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Response} from 'express';

import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {AuthService} from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto) {
    return this.authService.login(userDto);
  }

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto, @Res({passthrough: true}) response: Response) {
    const userData = await this.authService.registration(userDto);
    response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return userData;
  }
}
