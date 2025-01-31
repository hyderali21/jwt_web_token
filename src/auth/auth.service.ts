import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.tdo';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<{ message: string }> {
    const { name, email, password, confirmPassword } = dto;
    console.log("pass",password);
    console.log("confirmPassword",confirmPassword);
    
    
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }

    const hashedPassword =await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({ name, email, password: hashedPassword });
    await this.userRepository.save(newUser);

    return { message: 'User registered successfully' };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email }, { secret: process.env.SECRET_KEY, expiresIn: '24h' });

    return { accessToken: token };
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
