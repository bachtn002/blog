import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [AuthModule,UserModule,
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'blog_dev',
      entities: [
        User
      ],
      synchronize:true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AppModule {}
