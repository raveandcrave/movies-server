import {ApiProperty} from '@nestjs/swagger';
import {User} from 'src/users/users.entity';
import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

@Entity('roles')
export class Role {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'ADMIN', description: 'Значение роли пользователя'})
  @Column({unique: true})
  value: string;

  @ApiProperty({example: 'Администратор', description: 'Описание роли'})
  @Column()
  description: string;

  @ApiProperty({type: [User], example: ['user1', 'user2'], description: 'Пользователи с этой ролью'})
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
