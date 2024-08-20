import { DateInput } from "@formkit/tempo";
import { Type } from "class-transformer";
import { IsOptional, IsInt, IsPositive, IsDateString, Min } from "class-validator";

export class RequestAppointmentDto{

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    startHour: number;

    @IsOptional()
    @IsDateString()
    date: Date;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    userDni: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    doctorId: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    typeAppointmentId: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    stateId: number;

    @IsOptional()
    @IsPositive()
    @IsInt()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(0)
    offset?: number = 0;
}