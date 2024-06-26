import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { RequestPaginationDto } from '../../common/dtos/request-pagination.dto';

export class RequestScheduleDto{
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    doctorId: number;

    @IsOptional()
    @IsDateString({}, { message: "the date must be in YYYY-MM-DD format" })
    date: Date;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @IsPositive()
    startTime: number;

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