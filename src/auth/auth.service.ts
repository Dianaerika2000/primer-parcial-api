import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from 'src/common/dtos/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto:SignInDto): Promise<any> {
    const { email, password } = signInDto;
    const user = await this.usersService.findOne(email);

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    return {
      email: user.email,
      token: this.getJwtToken({ email }),
    };
  }

  async signUp(signUpDto: SignUpDto): Promise<any> {
    const userExists = await this.usersService.findByUsernameOrEmail(
      signUpDto.username,
      signUpDto.email,
    );

    if (userExists) {
      throw new Error('El usuario o el correo electrónico ya están registrados.');
    }

    const newUser = await this.usersService.create(signUpDto);

    return newUser;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
