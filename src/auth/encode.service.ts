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
    encryptedPassword: string,
  ): Promise<boolean> {
    return await compare(password, encryptedPassword);
  }
}
