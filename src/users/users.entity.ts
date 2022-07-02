import {ApiProperty} from '@nestjs/swagger';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('Users')
export class User {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'user@mail.ru', description: 'Email'})
  @Column({unique: true})
  email: string;

  @ApiProperty({example: '123456', description: 'Пароль пользователя'})
  @Column()
  password: string;

  @ApiProperty({example: 'true', description: 'Забанен или нет'})
  @Column({default: false})
  banned: boolean;

  @ApiProperty({example: 'Не любит кино', description: 'Причина бана'})
  @Column({nullable: true})
  banReason: string;
}
