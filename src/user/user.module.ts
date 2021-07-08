import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { PassportModule } from '@nestjs/passport';
import { Shop } from './entities/shop.entity';
import { ShopUser } from './entities/shop.user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService],
  imports: [
    JwtModule.register({
      secret:  jwtConstants.secret,
      
    }),
    TypeOrmModule.forFeature([User, Shop, ShopUser]),
    forwardRef(() => AuthModule)
  ],
})
export class UserModule {}
