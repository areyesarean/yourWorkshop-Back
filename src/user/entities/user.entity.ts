import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../dto/user.dto";

@Entity('User')
export class UserEntity{
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({type: "varchar", unique: true})
  username: string;

  @Column({type: "varchar", nullable: false})
  password: string;

  @Column({type: "varchar", nullable: true})
  name: string;

  @Column({type: "varchar", nullable: false})
  rol: Roles;
}