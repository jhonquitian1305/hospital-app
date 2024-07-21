import { DateInput } from "@formkit/tempo";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsPositive } from "class-validator";

export class RequestDoctorDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    typeId: number;

    @IsDateString()
    date: DateInput;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    startHour: number;
}