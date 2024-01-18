import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {}
