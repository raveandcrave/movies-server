import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';

import {User} from './users/users.entity';
import {UsersModule} from './users/users.module';
import {RolesModule} from './roles/roles.module';
import {Role} from './roles/roles.entity';
import {AuthModule} from './auth/auth.module';
import {Token} from './auth/tokens.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Role, Token],
      synchronize: true,
      //logging: 'all',
    }),
    UsersModule,
    RolesModule,
    AuthModule,
  ],
})
export class AppModule {}
