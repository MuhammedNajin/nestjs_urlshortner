import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/auth.schema';
import { CryptoService } from 'src/common/services/bycript';
import { AuthService } from './service/auth.service';
import { UserRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResponseMapper } from 'src/common/services/responseMapper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60s') },
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [
    CryptoService, 
    AuthService, 
    UserRepository,
    ResponseMapper
  ],
})

export class AuthModule {}
