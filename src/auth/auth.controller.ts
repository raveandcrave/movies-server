import {Body, Controller, Get, Post, Put, Req, Res} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Response, Request} from 'express';

import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {RegisterUserDto} from 'src/users/dto/register-user.dto';
import {AuthService} from './auth.service';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Put('/login')
  async login(@Body() userDto: CreateUserDto, @Res({passthrough: true}) response: Response) {
    const userData = await this.authService.login(userDto);
    response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return userData;
  }

  @Post('/registration')
  async registration(@Body() userDto: RegisterUserDto, @Res({passthrough: true}) response: Response) {
    const userData = await this.authService.registration(userDto);
    response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return userData;
  }

  @Put('/logout')
  async logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
    const {refreshToken} = request.cookies;
    await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
  }

  @Get('/refresh')
  async refresh(@Req() request: Request, @Res({passthrough: true}) response: Response) {
    const {refreshToken} = request.cookies;
    const userData = await this.authService.refresh(refreshToken);
    response.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

    return userData;
  }
}
