import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeAppointmentDto } from './create-type_appointment.dto';

export class UpdateTypeAppointmentDto extends PartialType(CreateTypeAppointmentDto) {}
