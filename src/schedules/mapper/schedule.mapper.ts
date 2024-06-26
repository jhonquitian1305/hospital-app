import { ResponseScheduleDto } from "../dto";
import { Schedule } from "../entities";

export class ScheduleMapper{
    static scheduleToScheduleDto(schedule: Schedule): ResponseScheduleDto {
        let scheduleDto: ResponseScheduleDto = {
            id: schedule.id,
            doctorId: schedule.doctor.id,
            doctorName: schedule.doctor.name,
            date: schedule.date,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
        }
        return scheduleDto;
    }
}