export interface CreateTaskDTO {
    title: string;
    description?: string;
    targetDate: Date;
    startDate?: Date;
    endDate?: Date;
    enrollmentId: number;
    gradeId?: number;
}

export interface ParamsTaskDTO {
    title?: string;
    enrollId?: number;
    completed?: boolean;
}
