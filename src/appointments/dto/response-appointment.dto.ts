class ResponseAppointmentDto {
    id:           number;
    description:  string;
    schedule:     Date;
    startHour:    number;
    completed_at: string;
    patient:      PatientResponse;
    doctor:       DoctorResponse;
    type:         TypeResponse;
    state:        StateResponse;
}

class DoctorResponse {
    id:         number;
    name:       string;
    username:   string;
}

class StateResponse {
    id:   number;
    name: string;
}

class TypeResponse {
    id:          number;
    name:        string;
}

class PatientResponse {
    id:         number;
    fullname:   string;
    dni:        string;
    email:      string;
}
