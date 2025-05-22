import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repository/auth.repository';
import { CryptoService } from 'src/common/services/bycript';
import { JwtService } from '@nestjs/jwt';
import { ResponseMapper } from 'src/common/services/responseMapper';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
    private responseMapper: ResponseMapper,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const comparePassword = await this.cryptoService.comparePassword(password, user.password);
    if (!comparePassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { user: { id: user.id, email: user.email } };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return this.responseMapper.success({
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
      },
      message: 'User logged in successfully',
    });
  }

  async register(name: string, email: string, password: string) {
    const userExist = await this.userRepository.findByEmail(email);
    if (userExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.cryptoService.hashPassword(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const payload = { user };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return this.responseMapper.success({
      data: {
        user,
        accessToken,
        refreshToken,
      },
      message: 'User registered successfully',
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userRepository.findById(payload.user.id);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { user };
      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      });

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      });

      return this.responseMapper.success({
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        message: 'Token refreshed successfully',
      });
    } catch (error) {
      console.error('Refresh Token Error:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout() {
    return this.responseMapper.success({
      data: null,
      message: 'User logged out successfully',
    });
  }
}