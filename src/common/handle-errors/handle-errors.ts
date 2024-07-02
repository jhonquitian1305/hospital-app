import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
export class HandleError{

    static handleDBErrors(error: any): void {
        if(error.sqlState === '23000'){
            const errorMessage = error.sqlMessage.split(' ');
            throw new BadRequestException(`Duplicate entry ${errorMessage[2]}`);
        }
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}