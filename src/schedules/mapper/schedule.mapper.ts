import { format } from "@formkit/tempo";
import { ResponseScheduleDto } from "../dto";
import { ResponseScheduleByHour } from "../dto/response-schedule-by-hour.dto";
import { Schedule, ScheduleByHour } from "../entities";

export class ScheduleMapper{
    static scheduleToScheduleDto(schedule: Schedule): ResponseScheduleDto {
        let scheduleDto: ResponseScheduleDto = {
            id: schedule.id,
            date: schedule.date,
            // doctor: {
            //     id: schedule.doctor.id,
            //     name: schedule.doctor.fullname
            // },
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
            doctor: {
                id: scheduleByHour.schedule.doctor.id,
                name: scheduleByHour.schedule.doctor.fullname,
            },
        }

        return scheduleByHourDto;
    }

    static transformTime(schedule: Schedule){
        return {
            date: format(schedule.date, 'DD-MM-YYYY'),
        }
    }
}