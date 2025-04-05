import { IsNotEmpty, IsString } from 'class-validator';


export class CreateUrlDto {
  @IsString({ message: 'url must be a string' })
  @IsNotEmpty({ message: 'url is required' })
  url: string;

}
