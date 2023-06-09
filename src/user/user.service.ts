import {
  HttpException,
  Injectable,
  HttpStatus,
  ConflictException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EncodeService } from 'src/auth/encode.service';
import { ActivateUserDto } from 'src/auth/dto/activate-user.dto';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
    private _encodeService: EncodeService,
  ) {}

  async findOne(email: string): Promise<UserEntity> {
    const user = await this._userRepository.findOne({ where: { email } });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  async findOneUserByEmailAndActive(email: string): Promise<UserEntity> {
    const user = await this._userRepository.findOne({
      where: { email, active: true },
    });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this._userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this._userRepository.find();
    return users;
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const { password } = user;
    const passHash = await this._encodeService.encodePassword(password);
    const activationToken = v4();
    const userPassHash = { ...user, password: passHash, activationToken };

    const userAfterCreate = this._userRepository.create(userPassHash);

    try {
      return await this._userRepository.save(userAfterCreate);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('This email is already registered');
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUser(
    email: string,
    updateUser:
      | UpdateUserDto
      | { active: boolean }
      | { resetPasswordToken: string },
  ): Promise<UserEntity> {
    const userFind = await this._userRepository.findOne({
      where: { email },
    });
    if (!userFind)
      throw new UnprocessableEntityException('User not found');
    const userBeforeUpdate = this._userRepository.merge(userFind, updateUser);
    return await this._userRepository.save(userBeforeUpdate);
  }

  async removeUser(id: string) {
    const userRemove = await this._userRepository.delete(id);
    const { affected } = userRemove;
    if (affected === 0) {
      throw new ConflictException('This id dont exist');
    }
    return id;
  }

  async findInactiveByIdAndActivationToken(
    data: ActivateUserDto,
  ): Promise<UserEntity> {
    const { activationToken, id } = data;
    const user = await this._userRepository.findOne({
      where: { id, activationToken, active: false },
    });
    if (!user) throw new UnprocessableEntityException();
    return user;
  }

  async findUserByResetPasswordToken(
    resetPasswordToken: string,
  ): Promise<UserEntity> {
    const user = await this._userRepository.findOne({
      where: { resetPasswordToken, active: true },
    });
    if (!user) throw new UnprocessableEntityException("Usuario no encontrado");
    return user;
  }

  async activateUser(data: ActivateUserDto): Promise<void> {
    const user = await this.findInactiveByIdAndActivationToken(data);
    await this.updateUser(user.email, { active: true });
  }

  async changePassword(email: string, newPassword: string) {
    return await this.updateUser(email, { password: newPassword });
  }
}
