import { BaseMetric, Occurrence } from './BaseMetric';

export interface SubMetric {
    name: string;
    subMetrics?: SubMetric[];
}

export interface PositiveOccurrence extends Occurrence {
    completedSubMetrics: SubMetric[];
}

export interface PositiveMetric extends BaseMetric {
    subMetrics: SubMetric[];
    occurrences: PositiveOccurrence[];
}