import { ResponseScheduleDto } from "../dto";
import { ResponseScheduleByHour } from "../dto/response-schedule-by-hour.dto";
import { Schedule, ScheduleByHour } from "../entities";

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

    static responseScheduleByHour(scheduleByHour: ScheduleByHour){
        const scheduleByHourDto: ResponseScheduleByHour = {            
            date: scheduleByHour.schedule.date,
            startHour: scheduleByHour.startHour,
            finalHour: scheduleByHour.finalHour,
            isAvailable: scheduleByHour.isAvailable,
            doctor: scheduleByHour.schedule.doctor.name,
        }

        return scheduleByHourDto;
    }
}