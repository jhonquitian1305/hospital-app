import { ResponseUserDto } from "../dto/response-user.dto";
import { User } from '../entities/user.entity';

export class UserMapper{
    static userToUserDto(user: User): ResponseUserDto {
        const userDto: ResponseUserDto = {
            id: user.id,
            fullname: user.fullname,
            dni: user.dni,
            email: user.email,
            isActive: user.isActive
        };
        
        return userDto;
    }
}