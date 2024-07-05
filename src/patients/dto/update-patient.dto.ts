import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

export class UpdateUserDto extends PartialType(CreatePatientDto) {}
