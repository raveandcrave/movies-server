import {ApiProperty} from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({example: 'user@mail.ru', description: 'Email'})
  readonly email: string;
  @ApiProperty({example: '123456', description: 'Пароль пользователя'})
  readonly password: string;
}
