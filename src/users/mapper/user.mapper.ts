import { CreateUserDto } from "../dto/create-user.dto";
import { ResponseUserDto } from "../dto/response-user.dto";
import { User } from '../entities/user.entity';

export class UserMapper{
    static userToUserDto(user: User){
        let userDto: ResponseUserDto = new ResponseUserDto();
        userDto.id = user.id;
        userDto.fullname = user.fullname;
        userDto.dni = user.dni;
        userDto.email = user.email;
        userDto.isActive = user.isActive;
        return userDto;
    }
}