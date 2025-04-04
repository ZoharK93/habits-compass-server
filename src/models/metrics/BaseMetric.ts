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
    POSITIVE = 'positive',
    NEGATIVE = 'negative',
    PASSIVE = 'passive'
}