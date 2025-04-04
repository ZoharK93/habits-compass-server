import { BaseMetric, Occurrence } from './BaseMetric';

export enum ExerciseCategory {
    STRENGTH = 'strength',
    CARDIO = 'cardio',
    SPORT = 'sport'
}

export interface ExerciseSet {
    weight: number;
    reps: number;
}

export interface Exercise {
    name: string;
    category: ExerciseCategory;
    timeSpent: number;
    sets?: ExerciseSet[];  // Only for strength exercises
}

export interface WorkoutOccurrence extends Occurrence {
    exercises: Exercise[];
}

export interface WorkoutMetric extends BaseMetric {
    occurrences: WorkoutOccurrence[];
}