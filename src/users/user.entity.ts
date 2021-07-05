import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.enum";


@Entity()
export class User{
    @PrimaryGeneratedColumn({
        type:'bigint'
    })
    UserId: string;
    @Column({
        type:'varchar',
        length:10,
    })
    Mobile: string;
    @Column({
        type:'varchar',
    })
    PasswordHash: string;
    @Column({
        type:'datetime',
    })
    CreatedUtcDate:Date;
    @Column({
        type:'enum',
        enum:Role,
        default:Role.USER
    })
    Role:Role;
}
