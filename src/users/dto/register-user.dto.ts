import {ApiProperty} from '@nestjs/swagger';
import {IsEmail, IsString, Length} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({example: 'user@mail.ru', description: 'Email'})
  @IsString({message: 'Дожно быть строкой'})
  @IsEmail({}, {message: 'Неккоректный Email'})
  readonly email: string;

  @ApiProperty({example: '123456', description: 'Пароль пользователя'})
  @IsString({message: 'Дожно быть строкой'})
  @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
  readonly password: string;

  @ApiProperty({example: 'user228', description: 'Имя пользователя'})
  @IsString({message: 'Дожно быть строкой'})
  @Length(4, 12, {message: 'Не меньше 4 и не больше 12'})
  readonly username: string;
}
