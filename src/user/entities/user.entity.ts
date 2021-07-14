import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Gender } from "./gender.enum";
import { Role } from "./role.enum";


@Entity({name:'T_User'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    UserId: string;

    @Column({ type: 'varchar', nullable: false, length: 20 })
    Mobile: string;

    @Column({ type: 'varchar', nullable: false, length: 255 })
    PasswordHash: string;

    @Column({ type: 'enum', enum: Role, nullable: true })
    Role: Role;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    Gender: Gender;

    @Column({ type: 'date', nullable: true })
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
