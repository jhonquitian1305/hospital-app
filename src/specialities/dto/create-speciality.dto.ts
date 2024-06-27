import { IsAlpha, IsString, MaxLength, MinLength } from "class-validator";

export class CreateSpecialityDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;
}
