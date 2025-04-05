import { Injectable } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  private readonly counterKey = 'counter';

  constructor(private readonly cacheManager: Cache) {}

  async incrementCounter(): Promise<number> {
    let value = await this.getCounter();
    value += 1;
    await this.cacheManager.set(this.counterKey, value);
    return value;
  }

  async getCounter(): Promise<number> {
    const value = await this.cacheManager.get(this.counterKey);
    return (value as number) || 0;
  }

  async resetCounter(): Promise<void> {
    await this.cacheManager.set(this.counterKey, 0);
  }
}
