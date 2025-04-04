import { BaseMetric, Occurrence } from './BaseMetric';

export interface ChoreDefinition {
    name: string;
    frequency: string;  // e.g., "daily", "weekly", "monthly"
}

export interface ChoreOccurrence extends Occurrence {
    choreName: string;
}

export interface ChoresMetric extends BaseMetric {
    chores: ChoreDefinition[];
    occurrences: ChoreOccurrence[];
}