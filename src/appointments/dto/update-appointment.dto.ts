import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateAppointmentDto {

    @IsString()
    @MaxLength(200)
    @MinLength(10)
    description: string;
}
