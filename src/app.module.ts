import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            uri: configService.get('MONGODB_URI'),
            dbName: configService.get('MONGODB_DB'),
        })
    }),
    AuthModule,
    UrlModule,
    CacheModule.register(),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
