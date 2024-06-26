import { IsArray, IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateScheduleDto {
    @IsNumber()
    doctorId: number;

    @IsNotEmpty()
    @IsArray()
    schedulesDto: SchedulesDto[];
}

export class SchedulesDto {
    @IsDate()
    date: Date;

    @IsNumber()
    startTime: number;
    
    @IsNumber()
    endTime: number;
}
