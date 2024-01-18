import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @HttpCode(HttpStatus.CREATED)
  // @Get(':email')
  // getOne(@Body('email') email: string) {
  //   console.log('email', email)
  //   return this.userService.findOne(email);
  // }

  // @HttpCode(HttpStatus.FOUND)
  // @Get(':email')
  // findOne(@Param('email') email: string) {
  //   return this.userService.findOne(email);
  // }
  
  
  @Get(':token')
  findOneByToken(@Param('token') token: string) {
    console.log('token', token);
    return this.userService.findByToken(token);
  }
  
}
