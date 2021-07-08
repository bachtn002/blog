import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtRefreshTokenStrategy } from './jwt.refreshtoken.strategy';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  controllers:[AuthController],
  providers: [AuthService,UserService, LocalStrategy,JwtStrategy, RolesGuard,JwtRefreshTokenStrategy],
  imports: [
    JwtModule.register({
      secret:  jwtConstants.secret,
      
    }),
    TypeOrmModule.forFeature([User]), 
    PassportModule,
    forwardRef(() => UserModule)
  ],
  exports: [AuthService,UserService],
  
})
export class AuthModule { }
