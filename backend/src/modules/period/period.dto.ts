import { StatusPeriod } from "@prisma/client";

export interface CreatePeriodDTO {
    label: string;
    startDate: string;
    endDate: string;
}

export interface UpdatePeriodDTO {
    status: StatusPeriod;
}
