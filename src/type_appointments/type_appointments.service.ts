import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeAppointmentDto } from './dto/create-type_appointment.dto';
import { UpdateTypeAppointmentDto } from './dto/update-type_appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeAppointment } from './entities/type_appointment.entity';
import { Repository } from 'typeorm';
import { HandleError } from 'src/common/handle-errors/handle-errors';
import { SpecialitiesService } from 'src/specialities/specialities.service';

@Injectable()
export class TypeAppointmentsService {

  constructor(
    @InjectRepository(TypeAppointment)
    private readonly typeAppointmentsRepository: Repository<TypeAppointment>,

    @Inject()
    private readonly specialitiesService: SpecialitiesService,
  ){}
  
  async create(createTypeAppointmentDto: CreateTypeAppointmentDto) {
    const { specialityId, ...typeAppointmentData } = createTypeAppointmentDto;

    const speciality = await this.specialitiesService.findOne(specialityId);

    try {
      const typeAppointment = this.typeAppointmentsRepository.create({
        ...typeAppointmentData,
        speciality,
      });
      return await this.typeAppointmentsRepository.save(typeAppointment);
    } catch (error) {
      HandleError.handleDBErrors(error)
    }
  }

  async findAll() {
    return await this.typeAppointmentsRepository.findBy({ isAvailable: true });
  }

  async findOne(id: number) {
    const typeAppointment = await this.typeAppointmentsRepository.findOneBy({ id, isAvailable: true });
    if(!typeAppointment)
      throw new NotFoundException(`Type appointment with id ${id} not found`);

    return typeAppointment;
  }

  async update(id: number, updateTypeAppointmentDto: UpdateTypeAppointmentDto) {
    const { specialityId, ...typeAppointmentData } = updateTypeAppointmentDto;

    const speciality = await this.specialitiesService.findOne(specialityId);

    try {
      const typeAppointment = await this.typeAppointmentsRepository.preload({
        id,
        speciality,
        ...typeAppointmentData,
      });

      if(!typeAppointment)
        throw new NotFoundException(`Type appointment with id ${id} not found`);

      return await this.typeAppointmentsRepository.save(typeAppointment);
    } catch (error) {
      HandleError.handleDBErrors(error);
    }
  }

  async remove(id: number) {
    const typeAppointment = await this.findOne(id);
    typeAppointment.isAvailable = false;
    this.typeAppointmentsRepository.save(typeAppointment);
  }
}
