import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from 'src/common/dtos/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // @HttpCode(HttpStatus.CREATED)
  // @Post('register')
  // signUp(@Body() signUpDto: SignUpDto) {
  //   return this.authService.signUp(signUpDto);
  // }
}
