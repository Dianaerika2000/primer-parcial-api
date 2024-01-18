import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from 'src/common/dtos/signUp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto:SignInDto): Promise<any> {
    const { email, password } = signInDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    return {
      email: user.email,
      token: this.getJwtToken({ email }),
    };
  }

  // async signUp(signUpDto: SignUpDto): Promise<any> {
  //   const userExists = await this.usersService.findByUsernameOrEmail(
  //     signUpDto.username,
  //     signUpDto.email,
  //   );

  //   if (userExists) {
  //     throw new Error('El usuario o el correo electrónico ya están registrados.');
  //   }

  //   const newUser = await this.usersService.create(signUpDto);

  //   return newUser;
  // }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async decodeToken(token: string): Promise<any> {
    try {
      const secretKey = this.configService.get('JWT_SECRET');

      const decodedToken = this.jwtService.verify(token, secretKey);

      const userEmail = decodedToken.email;
      const user = await this.userRepository.findOneBy({ email: userEmail });

      if (!user) {
        throw new UnauthorizedException(`User with id ${userEmail} not found`);
      }

      return user;
    } catch (error) {
      console.error('Error decoding token or finding user:', error);
      throw new UnauthorizedException('Unable to find user');
    }
  }
}
