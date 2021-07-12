import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Shop } from './user/entities/shop.entity';
import { ShopUser } from './user/entities/shop.user.entity';

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
        User, Shop, ShopUser
      ],
      synchronize:false,
    }),
  ],
})
export class AppModule {}
