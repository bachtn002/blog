import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.enum";
import { Shop } from "./shop.entity";

@Entity({ name: 'T_ShopUser' })
export class ShopUser {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    ShopUserId: string;

    @Column({ type: 'enum', enum: Role, nullable: true })
    Role: Role;

    @CreateDateColumn()
    CreatedUtcDate: Date;

    @UpdateDateColumn({ nullable: true })
    ModifiedUtcDate: Date;

    @Column({ type: 'bit', nullable: false, default: false })
    IsDelete: boolean;

    @Column({ type: 'varchar', nullable: false })
    UserId: string;

    @Column({ type: 'varchar', nullable: false })
    ShopId: String;
}