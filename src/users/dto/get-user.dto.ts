import {ApiProperty} from '@nestjs/swagger';
import {Role} from 'src/roles/roles.entity';
import {User} from '../users.entity';

export class GetUserDto {
  @ApiProperty({example: 'user@mail.ru', description: 'Email'})
  readonly email: string;

  @ApiProperty({example: 'userName', description: 'Имя пользователя'})
  readonly username: string;

  @ApiProperty({example: 123456, description: 'Id'})
  readonly id: number;

  @ApiProperty({example: true, description: 'Забанен'})
  readonly banned: boolean;

  @ApiProperty({example: 'Не любит кино', description: 'Причина бана'})
  readonly banReason: string;

  @ApiProperty({description: 'Роли'})
  readonly roles: Role[];

  constructor(model: User) {
    this.email = model.email;
    this.id = model.id;
    this.banned = model.banned;
    this.banReason = model.banReason;
    this.roles = model.roles;
    this.username = model.username;
  }
}
