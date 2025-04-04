import { BaseMetric, Occurrence } from './BaseMetric';

export interface NegativeOccurrence extends Occurrence {
    count: number;
}

export interface NegativeMetric extends BaseMetric {
    occurrences: NegativeOccurrence[];
}