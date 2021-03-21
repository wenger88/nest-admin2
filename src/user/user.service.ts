import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class UserService extends AbstractService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository);
  }

  async paginate(page: number = 1, relations = []): Promise<any> {
    const { data, meta } = await super.paginate(page, relations);

    return {
      data: data.map(user => {
        const { password, ...data } = user;
        return data;
      }),
      meta,
    };
  }
}
