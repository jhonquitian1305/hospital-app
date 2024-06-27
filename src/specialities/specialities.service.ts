import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Speciality } from './entities/speciality.entity';
import { HandleError } from '../common/handle-errors/handle-errors';

@Injectable()
export class SpecialitiesService {
  
  constructor(
    @InjectRepository(Speciality)
    private readonly specialityRepository: Repository<Speciality>,
  ){}

  async create(createSpecialityDto: CreateSpecialityDto) {
    try {
      const speciality = this.specialityRepository.create(createSpecialityDto);
      return await this.specialityRepository.save(speciality);      
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.specialityRepository.find();
  }

  async findOne(id: number) {
    const speciality = await this.specialityRepository.findOneBy({ id });
    if(!speciality)
      throw new NotFoundException(`Speciality with id ${id} not found`);
    return speciality;
  }

  async update(id: number, updateSpecialityDto: UpdateSpecialityDto) {
    try {
      const speciality = await this.specialityRepository.preload({
        id,
        ...updateSpecialityDto,
      })

      if(!speciality)
        throw new NotFoundException(`Speciality with id ${id} not found`);
      
      return await this.specialityRepository.save(speciality);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const speciality = await this.findOne(id);
    this.specialityRepository.remove(speciality);    
  }
}
