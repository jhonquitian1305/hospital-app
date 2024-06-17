import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from "bcrypt";
import { HandleError } from '../common/handle-errors/handle-errors';
import { PaginationDto } from 'src/common/dtos/request-pagination.dto';
import { skip } from 'node:test';
import { ResponsePaginatedDto } from 'src/common/dtos/response-pagination.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
  
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
  
      await this.userRepository.save(user);
  
      return user;      
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const users = await this.userRepository.findAndCount({
      take: paginationDto.limit,
      skip: paginationDto.offset,
    })

    const paginationUsers: ResponsePaginatedDto<ResponseUserDto> = {
      elements: users[0].map(user => UserMapper.userToUserDto(user)),
      totalElements: users[1],
      limit: paginationDto.limit,
      offset: paginationDto.offset,
    };

    return paginationUsers;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if(!user)
      throw new NotFoundException(`User with id ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { password, ...userData } = updateUserDto;

      const user = await this.userRepository.preload({
        id,
        ...userData,
      });

      if(!user) throw new NotFoundException(`User with id: ${id} not found`);

      await this.userRepository.save(user);

      return user;
    } catch (error) {
      HandleError.handleDBErrors(error);
    }

  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);

      if(!user) throw new NotFoundException(`User with id: ${id} not found`);

      user.isActive = false;
      await this.userRepository.save(user);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }
}
