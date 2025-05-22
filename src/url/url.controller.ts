import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dtos/createShortUrl.dto';
import { ExpandUrlDto } from './dtos/expandShortUrl.dto';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @UseGuards(AuthGuard)
  @Post('shorten')
  @HttpCode(HttpStatus.CREATED)
  async createShortUrl(@Body() userData: CreateUrlDto, @Req() req: Request) {
    const { url } = userData;
    const { id } = req.user;
    console.log('userId', id, req.user);
    console.log('url', url);
    return await this.urlService.create(url, id);
  }


  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  async getAllUrls(@Req() req: Request) {
    const { id } = req.user;
    console.log('Fetching URLs for userId:', id);
    return await this.urlService.getAllUrls(id);
  }


  @Get(':key')
  @HttpCode(HttpStatus.OK)
  async getShortUrl(@Param() credential: ExpandUrlDto, @Res() res: Response) {
    const { key } = credential;
    console.log('key', key);
    const url = await this.urlService.exapandShortUrl(key); 
    console.log('url', url);
    res.redirect(url);
  }

  
 
}