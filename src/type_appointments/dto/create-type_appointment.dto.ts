import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateTypeAppointmentDto {
    
    @IsString()
    @MinLength(5)
    @MaxLength(100)
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    specialityId: number;
}
