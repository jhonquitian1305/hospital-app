import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class RequestScheduleByHourDto{
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    doctorId: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    specialityId: number;
}