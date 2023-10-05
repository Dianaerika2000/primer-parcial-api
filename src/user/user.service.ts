import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from 'src/common/dtos/signUp.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string){
    return this.userRepository.findOneBy({ email: email});
  }

  async create(signUpDto: SignUpDto): Promise<User> {
    const newUser = this.userRepository.create(signUpDto);
    return await this.userRepository.save(newUser);
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', { username, email })
      .getOne();
  }
}
