import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.enum";
import { Shop } from "./shop.entity";
import { User } from "./user.entity";

@Entity({name: 'T_ShopUser'})
export class ShopUser{
    @PrimaryGeneratedColumn({type:'bigint'})
    ShopUserId: string;

    @Column({ type: 'enum',enum: Role, default: Role.EMPLOYER})
    Role:Role;

    @CreateDateColumn()
    CreatedUtcDate: Date;

    @UpdateDateColumn({nullable: true})
    ModifiedUtcDate: Date;

    @Column({ type: 'bit', nullable: false, default: false})
    IsDelete: boolean;

    @ManyToOne(()=>User, user=>user.UserId,{ nullable: false})
    @JoinColumn({name:'UserId'})
    user:User;
    
    @ManyToOne(()=>Shop,shop=>shop.ShopId, {nullable: false})
    @JoinColumn({name:'ShopId'})
    shop:Shop
}