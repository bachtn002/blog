import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from 'src/shop/entities/shop.entity';
import { ShopUser } from 'src/shop/entities/shop.user.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, RolesGuard],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY_TOKEN,
    }),
    TypeOrmModule.forFeature([User, Shop, ShopUser]),
    PassportModule,
    forwardRef(() => UserModule)
  ],
  exports: [AuthService, UserService],

})
export class AuthModule { }
