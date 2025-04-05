import { Module } from '@nestjs/common';
import { UrlEncoder } from 'src/common/services/urlEncoding';
import { UrlController } from './url.controller';
import { UrlRepository } from './url.repository';
import { UrlService } from './url.service';
import { ResponseMapper } from 'src/common/services/responseMapper';
import { CacheService } from 'src/cache/cacheService';
import { Url, UrlSchema } from './schema/url.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
     MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
     CacheModule.register(),
     JwtModule.registerAsync({
           imports: [ConfigModule], 
           inject: [ConfigService],
           useFactory: async (configService: ConfigService) => ({
             secret: configService.get<string>('JWT_SECRET'),
             signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60s') },
           }),
         }),
  ],
  providers: [UrlEncoder, UrlRepository, UrlService, ResponseMapper, CacheService, ],
  controllers: [UrlController],
})
export class UrlModule {}
