import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  @SkipThrottle({ default: false })
  getUserById(@Param('id') id: number, @Request() req) {
    return this.usersService.getUserById(id);
  }
}
