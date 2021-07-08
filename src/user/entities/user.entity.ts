import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Gender } from "./gender.enum";
import { Role } from "./role.enum";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    UserId: string;

    @Column({ type: 'varchar', nullable: false, length: 20 })
    Mobile: string;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    PasswordHash: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    Role: Role;

    @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
    Gender: Gender;

    @Column({ type: 'date', nullable: false })
    DOB: Date;

    @Exclude()
    @Column({ nullable: true})
    public RefreshToken?: string;

    @Column({ type: 'bit', nullable: false, default: false })
    IsDelete: boolean;

    @CreateDateColumn()
    CreatedUtcDate: Date;

    @UpdateDateColumn({nullable: true})
    ModifiedUtcDate: Date;

}
