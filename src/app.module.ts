import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Shop } from './shop/entities/shop.entity';
import { ShopUser } from './shop/entities/shop.user.entity';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      entities: [
        User, Shop, ShopUser
      ],
      synchronize: false,
    }), AuthModule, UserModule, ShopModule
  ],
})
export class AppModule { }
