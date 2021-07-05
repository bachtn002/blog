import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  exports: [UsersService]
})
export class UsersModule {}
