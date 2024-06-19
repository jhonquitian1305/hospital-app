import { IsAlphanumeric, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateDoctorDto {

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(5)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number',
    })
    password: string;
}
