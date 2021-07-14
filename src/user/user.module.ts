import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Shop } from './entities/shop.entity';
import { ShopUser } from './entities/shop.user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY_TOKEN,
      
    }),
    TypeOrmModule.forFeature([User, Shop, ShopUser]),
    forwardRef(() => AuthModule)
  ],
})
export class UserModule {}
