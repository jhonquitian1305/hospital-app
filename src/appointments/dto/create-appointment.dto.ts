import { IsDateString, IsNumber, Max, Min } from "class-validator";

export class CreateAppointmentDto {

    @IsNumber()
    userId: number;

    @IsNumber()
    doctorId: number;

    @IsDateString()
    schedule: Date;

    @IsNumber()
    @Min(1)
    @Max(24)
    startHour: number;

    @IsNumber()
    typeId: number;
}
