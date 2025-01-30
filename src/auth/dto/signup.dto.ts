import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example:'ali',description :' name of user'})
  @IsNotEmpty()
  name: string;

  @ApiProperty ({ example:'hyder@gmail.com', description : 'Email address '})
  @IsEmail()
  email: string;
  
  @ApiProperty({ example:"12345yhsdgfg", description: 'Password field minimum 8 character'})
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({ example:"12345yhsdgfg",description: 'to confirm password'})
  @IsNotEmpty()
  confirmPassword: string;
}