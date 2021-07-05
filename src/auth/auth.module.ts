import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  providers: [AuthService, LocalStrategy,JwtStrategy, RolesGuard, UsersService],
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' }
    }),
    TypeOrmModule.forFeature([User]), UsersModule, PassportModule
  ],
  exports: [AuthService,UsersService],
})
export class AuthModule { }
