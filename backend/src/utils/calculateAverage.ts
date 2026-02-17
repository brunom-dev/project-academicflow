import { Grade } from "@prisma/client";

function calculateAverage(grades: Grade[]) {
    let totalPoints: number = 0 
    let totalWeights: number = 0;

    grades.forEach((grade) => {
        totalPoints += Number(grade.obtainedValue) * grade.weight;
        totalWeights += grade.weight;
    })

    return (totalPoints / totalWeights);
}

export { calculateAverage };