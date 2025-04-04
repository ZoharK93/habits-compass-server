import { BaseMetric, Occurrence } from './BaseMetric';

export interface PassiveOccurrence extends Occurrence {
    value: number;
}

export interface PassiveMetric extends BaseMetric {
    occurrences: PassiveOccurrence[];
}