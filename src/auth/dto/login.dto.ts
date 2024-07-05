import { IsEmail, IsString, MaxLength, minLength, MinLength } from "class-validator";

export class LoginDto{

    @IsString()
    @MinLength(5)
    email: string;

    
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;

}