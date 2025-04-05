import { BadRequestException, Injectable } from '@nestjs/common';
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

    const comparePassword = await this.cryptoService.comparePassword(
      password,
      user.password,
    );
    if (!comparePassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ user });
    return this.responseMapper.success({
      data: { user, token },
      message: 'User logged in successfully',
    });
  }

  async register(name: string, email: string, password: string) {
    const userExist = await this.userRepository.findByEmail(email);

    console.log('userExist', userExist);

    if (userExist) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.cryptoService.hashPassword(password);
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await this.jwtService.signAsync({ user });
    
    return this.responseMapper.success({
      data: { user, token },
      message: 'User registered successfully',
    });
  }
}
