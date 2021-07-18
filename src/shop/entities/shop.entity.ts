import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ShopStatus } from "./shop.status.enum";

@Entity({name:'T_Shop'})
export class Shop {

    @PrimaryGeneratedColumn('uuid')
    ShopId: String;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    UserId: string;

    @Column({ type: 'nvarchar', nullable: false, length: 255 })
    ShopName: string;

    @Column({ type: 'nvarchar', nullable: false, length: 2500 })
    ShopAdress: string;

    @Column({ type: 'nvarchar', nullable: false, length: 2500 })
    Description: string;

    @Column({ type: 'enum',enum: ShopStatus,nullable: true})
    ShopStatus: ShopStatus;

    @Column({ type: 'bit', nullable: false, default: false})
    IsDelete: boolean;

    @CreateDateColumn()
    CreatedUtcDate: Date;

    @UpdateDateColumn({nullable: true})
    ModifiedUtcDate: Date;

    

    
}