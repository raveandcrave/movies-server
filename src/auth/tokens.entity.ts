import {ApiProperty} from '@nestjs/swagger';
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from 'src/users/users.entity';

@Entity('tokens')
export class Token {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: '22', description: 'Id пользователя'})
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ApiProperty({example: 'asqsdw1dawdeWSDas', description: 'Рефреш токен'})
  @Column()
  refreshToken: string;
}
