import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlEncoder {
  private readonly base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly base = this.base62Chars.length; // 62
  private readonly minLength = 7; // Set to 7 for 7-character keys
  private readonly offset = 1000000; // Increased offset to fill 7 chars sooner

  /**
   * Encodes a number into a Base62 string with exactly 7 characters
   * @param num The number to encode
   * @returns The 7-character Base62 encoded string
   */
  encode(num: number): string {
    if (!Number.isInteger(num) || num < 0) {
      throw new Error('Input must be a non-negative integer');
    }
    
    // Apply offset to ensure larger numbers
    num += this.offset;
    
    if (num === this.offset) {
      return this.base62Chars[0].repeat(this.minLength); // "0000000" for first entry
    }

    let encoded = '';
    while (num > 0) {
      const remainder = num % this.base;
      encoded = this.base62Chars[remainder] + encoded;
      num = Math.floor(num / this.base);
    }

    // Pad with leading zeros if shorter than 7 characters
    while (encoded.length < this.minLength) {
      encoded = this.base62Chars[0] + encoded;
    }
    
    return encoded;
  }

  /**
   * Decodes a Base62 string back to a number
   * @param encoded The Base62 string to decode
   * @returns The decoded number
   */
  decode(encoded: string): number {
    if (!encoded || typeof encoded !== 'string' || encoded.length !== this.minLength) {
      throw new Error(`Input must be a ${this.minLength}-character string`);
    }

    let num = 0;
    for (let i = 0; i < encoded.length; i++) {
      const char = encoded[i];
      const value = this.base62Chars.indexOf(char);
      if (value === -1) {
        throw new Error(`Invalid Base62 character: ${char}`);
      }
      num = num * this.base + value;
    }
    return num - this.offset; // Subtract offset to get original counter
  }

  /**
   * Generates a unique 7-character Base62 short code
   * @param salt Optional salt to increase uniqueness
   * @returns A 7-character Base62 encoded string
   */
  generateShortCode(salt: number = 0): string {
    const uniqueNum = Date.now() + salt; // Timestamp-based alternative
    return this.encode(uniqueNum);
  }
}