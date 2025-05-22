import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response, Request } from 'express';
import { CreateUserDto } from '../dtos/signup.dtos';
import { SigninDto } from '../dtos/signin.dtos';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() userData: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { name, email, password } = userData;
    const response = await this.authService.register(name, email, password);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      data: { user: response.data.user, accessToken: response.data.accessToken },
      message: response.message,
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() credential: SigninDto, @Res({ passthrough: true }) res: Response) {
    const { email, password } = credential;
    const response = await this.authService.login(email, password);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      data: { user: response.data.user, accessToken: response.data.accessToken },
      message: response.message,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not found');
    }
    const response = await this.authService.refreshToken(refreshToken);

    res.cookie('refreshToken', response.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      data: { accessToken: response.data.accessToken },
      message: response.message,
    };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {

    const response = await this.authService.logout();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return response;
  }
}