export class ResponseScheduleDto{
    id: number;
    doctor: DoctorResponse;
    date: Date;
    startTime: number;
    endTime: number;
}

class DoctorResponse {
    id: number;
    name: string;
}