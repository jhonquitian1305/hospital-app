export class ResponseScheduleByHour {
    date:        Date;
    startHour:   number;
    finalHour:   number;
    isAvailable: boolean;
    doctor:      DoctorResponse;
}

class DoctorResponse {
    id: number;
    name: string;
}