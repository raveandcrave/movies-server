import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({default: false})
  banned: boolean;

  @Column({nullable: true})
  banReason: string;
}
