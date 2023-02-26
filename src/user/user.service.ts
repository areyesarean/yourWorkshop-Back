import {
  HttpException,
  Injectable,
  HttpStatus,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { EncodeService } from 'src/auth/encode.service';

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

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this._userRepository.find();
    return users;
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const { password } = user;
    const passHash = await this._encodeService.encodePassword(password);
    const userPassHash = { ...user, password: passHash };
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
    updateUser: UpdateUserDto,
  ): Promise<UserEntity> {
    const userFind = await this._userRepository.findOne({
      where: { email },
    });
    if (!userFind)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
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
}
