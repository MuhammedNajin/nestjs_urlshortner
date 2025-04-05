import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { CacheService } from 'src/cache/cacheService';
import { FilePersistenceService } from 'src/cache/FilePersistenceService';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    private readonly cacheService: CacheService,
    private readonly filePersistenceService: FilePersistenceService
  ) {
    process.on('SIGTERM', () => this.handleShutdown());
    process.on('SIGINT', () => this.handleShutdown());
  }

  private async handleShutdown(): Promise<void> {
    const value = await this.cacheService.getCounter();
    await this.filePersistenceService.saveCounterToFile(value);
    process.exit(0);
  }

  async onApplicationShutdown(): Promise<void> {
    const value = await this.cacheService.getCounter();
    await this.filePersistenceService.saveCounterToFile(value);
  }
}
