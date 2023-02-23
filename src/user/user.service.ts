import {
  UnprocessableEntityException,
  HttpException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findOne(username: string): Promise<UserEntity> {
    const user = await this._userRepository.findOne({ where: { username } });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return await this._userRepository.find();
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const searchUser = await this._userRepository.find({
      where: { username: user.username },
    });

    if (searchUser.length !== 0) {
      throw new UnprocessableEntityException('user exist');
    }

    const userAfterCreate = this._userRepository.create(user);
    return await this._userRepository.save(userAfterCreate);
  }
}
