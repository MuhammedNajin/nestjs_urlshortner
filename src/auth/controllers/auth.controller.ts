import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response } from 'express';
import { CreateUserDto } from '../dtos/signup.dtos';
import { SigninDto } from '../dtos/signin.dtos';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() userData: CreateUserDto, @Res() res: Response) {
         
        const { name, email, password } = userData;
        return await this.authService.register(name, email, password);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signin(@Body() credential: SigninDto, @Res() res: Response)  {
        const { email, password } = credential;
        return await this.authService.login(email, password);
    }
}
