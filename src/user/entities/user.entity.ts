import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from '../dto/user.dto';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  rol: Roles;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'uuid', name: 'activation_token', nullable: false, unique: true })
  activationToken: string;

  @Column({ type: 'uuid', name: 'reset_password_token', nullable: true, unique: true })
  resetPasswordToken: string;

  @CreateDateColumn({name: "create_one"})
  createOne: Date;
}
