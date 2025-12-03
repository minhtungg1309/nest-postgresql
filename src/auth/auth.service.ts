import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswordHelper } from '@/helpers/util';
import { CodeAuthDto, CreateAuthDto, ChangePasswordAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    
    const isValidPassword = await comparePasswordHelper(pass, user.password);
    if (!isValidPassword) return null;
    
    return user;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id,  
      email: user.email,
      name: user.name,
      role: user.role
    };
    
    return {
      user: {
        id: user.id, 
        email: user.email,
        name: user.name,
        role: user.role
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    return await this.usersService.handleRegister(registerDto);
  }

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  }

  retryActive = async (email: string) => {
    return await this.usersService.retryActive(email);
  }

  retryPassword = async (email: string) => {
    return await this.usersService.retryPassword(email);
  }

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  }
}