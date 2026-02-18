import { StatusPeriod } from "@prisma/client";

export interface UpdatePeriodDTO {
    status: StatusPeriod;
}
