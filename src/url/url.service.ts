import { Injectable } from '@nestjs/common';
import { UrlRepository } from './url.repository';
import { UrlEncoder } from 'src/common/services/urlEncoding';
import { ResponseMapper } from 'src/common/services/responseMapper';
import { CacheService } from 'src/cache/cacheService';

@Injectable()
export class UrlService {
  constructor(
    private urlRepository: UrlRepository,
    private urlEncoder: UrlEncoder,
    private responseMapper: ResponseMapper,
    private cacheService: CacheService,
  ) {}

  async create(url: string, userId: string) {
      
      const counter = await this.cacheService.getCounter()
      await this.cacheService.incrementCounter()
      const shortId = this.urlEncoder.generateShortCode(counter);

      console.log('shortId', shortId, counter)
      await this.urlRepository.create({ shortId, url, userId}); 

      return this.responseMapper.success({
        data: `${process.env.DOMAIN}/${shortId}`,
        message: 'Short URL created successfully',
      })
  }

  async exapandShortUrl(key: string): Promise<string> {
    const urlDoc = await this.urlRepository.findByKey(key);
    return urlDoc.url;
  }
}
