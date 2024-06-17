import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsInt, Min } from "class-validator";

export class PaginationDto {
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