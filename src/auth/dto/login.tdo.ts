import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty ({ example:'abc@gmail.com', description : 'Email address '})
    @IsEmail()
    @ApiProperty()
    email: string;
  
    @ApiProperty({ example:'hasd4567', description: 'Password field minimum 8 character'})
    @IsNotEmpty()
    password: string;
  }
  