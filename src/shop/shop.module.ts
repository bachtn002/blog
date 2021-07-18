import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Shop } from './entities/shop.entity';
import { ShopUser } from './entities/shop.user.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports:[
    TypeOrmModule.forFeature([User, Shop, ShopUser]),
  ]
})
export class ShopModule {}
