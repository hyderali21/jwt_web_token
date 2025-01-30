import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.tdo';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @ApiOperation( { description: 'signing the users with name, email, password, confimpassword '})
    signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @ApiOperation( { description: 'Logging  the users with name and email field '})
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    

    @Get('users')
    @ApiOperation({ description:" getting user data while passing data through headers "})
    getUsers(@Request() req) {
        return this.authService.getUsers();
    }
}
