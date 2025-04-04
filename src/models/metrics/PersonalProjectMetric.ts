import { BaseMetric, Occurrence } from './BaseMetric';

export interface ProjectOccurrence extends Occurrence {
    projectName: string;
    timeSpent: number;  // Time spent in minutes
}

export interface PersonalProjectMetric extends BaseMetric {
    projects: string[];  // List of project names
    occurrences: ProjectOccurrence[];
}