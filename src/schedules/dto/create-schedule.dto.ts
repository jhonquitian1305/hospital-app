import { DateInput } from "@formkit/tempo";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateScheduleDto {

    @IsNotEmpty()
    @IsArray()
    @Type(() => SchedulesDto)
    schedulesDto: SchedulesDto[];
}

export class SchedulesDto {
    @IsDateString({}, { message: "the date must be in YYYY-MM-DD format" })
    date: DateInput;

    @IsNumber()
    startTime: number;
    
    @IsNumber()
    endTime: number;
}
