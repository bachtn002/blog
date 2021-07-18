import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopDto } from './dto/shop.dto';
import { Shop } from './entities/shop.entity';
import { ShopUser } from './entities/shop.user.entity';

@Injectable()
export class ShopService {
    constructor
        (
            @InjectRepository(Shop)
            private readonly shopRepo: Repository<Shop>,
            @InjectRepository(ShopUser)
            private readonly shopUserRepo: Repository<ShopUser>,
    ) { }
    public async create(dto: ShopDto) {
        console.log(dto);
        const shop = await this.shopRepo.findOne({ ShopName: dto.shopName, UserId: dto.userId, IsDelete: false });
        console.log(shop);
        if (shop) {
            throw new HttpException({ message: 'Shop name must be unique' }, HttpStatus.BAD_REQUEST);
        } else {
            const shopSaved = this.shopRepo.create({
                ShopName: dto.shopName,
                UserId: dto.userId,
            });
            await this.shopRepo.save(shopSaved);
            const newShop = await this.shopRepo.findOne({ ShopName: dto.shopName, UserId: dto.userId, IsDelete: false });
            console.log(newShop);
            
            const shopUserSaved = this.shopUserRepo.create({
                Role: dto.role,
                UserId: dto.userId,
                ShopId: newShop.ShopId,
            });
            await this.shopUserRepo.save(shopUserSaved);
            return { shopSaved, shopUserSaved };
        }
    }
}
