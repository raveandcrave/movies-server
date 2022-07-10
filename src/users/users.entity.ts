import {ApiProperty} from '@nestjs/swagger';
import {Role} from 'src/roles/roles.entity';
import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
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

  @ApiProperty({example: 'Не любит кино', description: 'Причина бана', required: false})
  @Column({nullable: true})
  banReason: string;

  @ApiProperty({type: [Role], example: ['USER', 'ADMIN'], description: 'Роли пользователя'})
  @ManyToMany(() => Role, (role) => role.users, {cascade: ['insert'], eager: true})
  @JoinTable({name: 'user_roles'})
  roles: Role[];
}
