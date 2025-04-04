import { MetricType, BaseMetric } from '../models/metrics/BaseMetric';
import logger from '../utils/logger';
import { GuitarMetric, GuitarOccurrence } from '../models/metrics/GuitarMetric';
import { WorkoutMetric, WorkoutOccurrence, ExerciseCategory } from '../models/metrics/WorkoutMetric';
import { ChoresMetric, ChoreOccurrence } from '../models/metrics/ChoresMetric';
import { PersonalProjectMetric, ProjectOccurrence } from '../models/metrics/PersonalProjectMetric';

export class MetricValidator {
    public static validateMetric(metric: BaseMetric): boolean {
        logger.debug('Validating metric', { type: metric.type });
        switch (metric.type) {
            case MetricType.GUITAR:
                return this.validateGuitarMetric(metric as GuitarMetric);
            case MetricType.WORKOUT:
                return this.validateWorkoutMetric(metric as WorkoutMetric);
            case MetricType.CHORES:
                return this.validateChoresMetric(metric as ChoresMetric);
            case MetricType.PERSONAL_PROJECT:
                return this.validatePersonalProjectMetric(metric as PersonalProjectMetric);
            default:
                return true;
        }
    }

    private static validateGuitarMetric(metric: GuitarMetric): boolean {
        logger.debug('Validating guitar metric', { name: metric.name });
        if (!metric.occurrences) return false;
        return metric.occurrences.every(occurrence => {
            const guitarOcc = occurrence as GuitarOccurrence;
            return this.validateGuitarActivity(guitarOcc.jamming) &&
                   this.validateGuitarActivity(guitarOcc.learningNewSongs) &&
                   this.validateGuitarActivity(guitarOcc.techniquePractice) &&
                   this.validateGuitarActivity(guitarOcc.playByEar);
        });
    }

    private static validateGuitarActivity(activity: any): boolean {
        logger.debug('Validating guitar activity');
        if (!activity) return true;
        return Array.isArray(activity.songs) &&
               activity.date instanceof Date &&
               typeof activity.timeSpent === 'number';
    }

    private static validateWorkoutMetric(metric: WorkoutMetric): boolean {
        logger.debug('Validating workout metric', { name: metric.name });
        if (!metric.occurrences) return false;
        return metric.occurrences.every(occurrence => {
            const workoutOcc = occurrence as WorkoutOccurrence;
            return Array.isArray(workoutOcc.exercises) &&
                   workoutOcc.exercises.every(exercise => 
                       typeof exercise.name === 'string' &&
                       Object.values(ExerciseCategory).includes(exercise.category) &&
                       typeof exercise.timeSpent === 'number' &&
                       (exercise.category !== ExerciseCategory.STRENGTH || 
                        (Array.isArray(exercise.sets) &&
                         exercise.sets.every(set => 
                             typeof set.weight === 'number' &&
                             typeof set.reps === 'number'
                         ))
                       )
                   );
        });
    }

    private static validateChoresMetric(metric: ChoresMetric): boolean {
        logger.debug('Validating chores metric', { name: metric.name });
        if (!metric.occurrences || !Array.isArray(metric.chores)) return false;
        const validChores = metric.chores.every(chore =>
            typeof chore.name === 'string' &&
            typeof chore.frequency === 'string'
        );
        const validOccurrences = metric.occurrences.every(occurrence => {
            const choreOcc = occurrence as ChoreOccurrence;
            return typeof choreOcc.choreName === 'string' &&
                   choreOcc.date instanceof Date;
        });
        return validChores && validOccurrences;
    }

    private static validatePersonalProjectMetric(metric: PersonalProjectMetric): boolean {
        if (!metric.occurrences || !Array.isArray(metric.projects)) return false;
        return metric.occurrences.every(occurrence => {
            const projectOcc = occurrence as ProjectOccurrence;
            return typeof projectOcc.projectName === 'string' &&
                   typeof projectOcc.timeSpent === 'number' &&
                   projectOcc.date instanceof Date;
        });
    }

    public static validateMetricOccurrence(type: MetricType, occurrence: any): boolean {
        logger.debug('Validating metric occurrence', { type });
        switch (type) {
            case MetricType.GUITAR:
                return this.validateGuitarActivity(occurrence);
            case MetricType.WORKOUT:
                return this.validateWorkoutOccurrence(occurrence);
            case MetricType.CHORES:
                return this.validateChoreOccurrence(occurrence);
            case MetricType.PERSONAL_PROJECT:
                return this.validateProjectOccurrence(occurrence);
            default:
                return false;
        }
    }

    private static validateWorkoutOccurrence(occurrence: WorkoutOccurrence): boolean {
        logger.debug('Validating workout occurrence', { exercises: occurrence.exercises?.length });
        return Array.isArray(occurrence.exercises) &&
               occurrence.exercises.every(exercise => 
                   typeof exercise.name === 'string' &&
                   typeof exercise.sets === 'number' &&
                   Object.values(ExerciseCategory).includes(exercise.category)
               );
    }

    private static validateChoreOccurrence(occurrence: ChoreOccurrence): boolean {
        logger.debug('Validating chore occurrence');
        return typeof occurrence.date === 'object' &&
               occurrence.date instanceof Date;
    }

    private static validateProjectOccurrence(occurrence: ProjectOccurrence): boolean {
        logger.debug('Validating project occurrence');
        return typeof occurrence.date === 'object' &&
               occurrence.date instanceof Date &&
               typeof occurrence.timeSpent === 'number' &&
               occurrence.timeSpent > 0;
    }
}