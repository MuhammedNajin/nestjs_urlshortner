import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FilePersistenceService {
  private readonly counterFilePath = path.join(__dirname, 'counter.json');

  async loadCounterFromFile(): Promise<number> {
    try {
      const data = await fs.readFile(this.counterFilePath, 'utf-8');
      const { value } = JSON.parse(data);
      return typeof value === 'number' ? value : 0;
    } catch (error) {
      console.log('No existing counter file found, starting at 0');
      return 0;
    }
  }

  async saveCounterToFile(value: number): Promise<void> {
    try {
      await fs.writeFile(this.counterFilePath, JSON.stringify({ value }, null, 2));
    } catch (error) {
      console.error('Failed to save counter:', error);
    }
  }
}
