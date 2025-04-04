export interface Occurrence {
    date: Date;
}

export interface BaseMetric {
    id?: string;
    name: string;
    type: MetricType;
    occurrences: Occurrence[];
}

export enum MetricType {
    GUITAR = 'guitar',
    WORKOUT = 'workout',
    CHORES = 'chores',
    PERSONAL_PROJECT = 'personal_project',
    NEGATIVE = 'negative',
    PASSIVE = 'passive'
}