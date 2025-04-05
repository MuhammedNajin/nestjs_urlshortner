import { IsString, MaxLength } from 'class-validator';

export class ExpandUrlDto {
  @IsString({ message: 'url must be a string' })
  @MaxLength(7)
  key: string;
}
