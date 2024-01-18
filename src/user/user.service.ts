import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SignUpDto } from 'src/common/dtos/signUp.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async findOne(email: string){
    return this.userRepository.findOneBy({ email: email});
  }

  async findOneById(id: number){
    const user = await this.userRepository.findOneBy({ id: id});

    if(!user){
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByToken(token: string) {
    const user = await this.authService.decodeToken(token);
    return user;
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
