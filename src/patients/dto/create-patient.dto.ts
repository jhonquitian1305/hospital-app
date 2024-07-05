import { IsEmail, IsNumberString, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto {

    @IsString()
    @MinLength(4)
    fullname: string;

    @IsNumberString()
    @MinLength(5)
    dni: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'The password must have a Uppercase, lowercase letter and a number'
        }
    )
    password: string;
}
