import { BaseMetric, Occurrence } from './BaseMetric';

export interface GuitarActivity {
    songs: string[];
    date: Date;
    timeSpent: number;
}

export interface GuitarOccurrence extends Occurrence {
    jamming?: GuitarActivity;
    learningNewSongs?: GuitarActivity;
    techniquePractice?: GuitarActivity;
    playByEar?: GuitarActivity;
}

export interface GuitarMetric extends BaseMetric {
    occurrences: GuitarOccurrence[];
}