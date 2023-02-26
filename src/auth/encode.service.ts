import { Injectable } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt';

@Injectable()
export class EncodeService {
  
  async encodePassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }

  async checkPassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return await compare(password, userPassword);
  }
}
