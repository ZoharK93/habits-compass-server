import { MetricRepository } from '../data/MetricRepository';
import { MetricValidator } from './MetricValidator';
import { MetricType, BaseMetric, Occurrence } from '../models/metrics/BaseMetric';
import { MetricEntry } from '../models/MetricEntry';
import logger from '../utils/logger';

export class MetricService {
    private metricRepository: MetricRepository;

    constructor() {
        this.metricRepository = new MetricRepository();
    }

    public async createMetric(metric: BaseMetric): Promise<BaseMetric> {
        logger.info('Creating new metric', { type: metric.type });
        if (!MetricValidator.validateMetric(metric)) {
            logger.error('Invalid metric data', { metric });
            throw new Error('Invalid metric data');
        }
        const result = await this.metricRepository.createMetric(metric);
        logger.info('Successfully created metric', { id: result.id });
        return result;
    }

    public async editMetric(id: string, metric: BaseMetric): Promise<BaseMetric> {
        logger.info('Editing metric', { id, type: metric.type });
        if (!MetricValidator.validateMetric(metric)) {
            logger.error('Invalid metric data for edit', { id, metric });
            throw new Error('Invalid metric data');
        }
        const result = await this.metricRepository.editMetric(id, metric);
        logger.info('Successfully edited metric', { id });
        return result;
    }

    public async logMetricOccurrence(id: string, occurrence: Occurrence): Promise<void> {
        logger.info('Logging metric occurrence', { id });
        const metric = await this.getMetric(id);
        if (!metric) {
            logger.error('Metric not found', { id });
            throw new Error('Metric not found');
        }
        
        // Add the occurrence to the metric
        metric.occurrences = [...metric.occurrences, occurrence];
        
        // Validate the updated metric
        if (!MetricValidator.validateMetric(metric)) {
            logger.error('Invalid occurrence data', { id, occurrence });
            throw new Error('Invalid occurrence data');
        }
        
        await this.metricRepository.editMetric(id, metric);
        logger.info('Successfully logged metric occurrence', { id });
    }

    public async editMetricOccurrence(id: string, occurrenceIndex: number, occurrence: Occurrence): Promise<void> {
        logger.info('Editing metric occurrence', { id, occurrenceIndex });
        const metric = await this.getMetric(id);
        if (!metric) {
            logger.error('Metric not found', { id });
            throw new Error('Metric not found');
        }
        if (occurrenceIndex < 0 || occurrenceIndex >= metric.occurrences.length) {
            logger.error('Invalid occurrence index', { id, occurrenceIndex, totalOccurrences: metric.occurrences.length });
            throw new Error('Invalid occurrence index');
        }
        
        // Update the occurrence
        metric.occurrences[occurrenceIndex] = occurrence;
        
        // Validate the updated metric
        if (!MetricValidator.validateMetric(metric)) {
            logger.error('Invalid occurrence data', { id, occurrenceIndex, occurrence });
            throw new Error('Invalid occurrence data');
        }
        
        await this.metricRepository.editMetric(id, metric);
        logger.info('Successfully edited metric occurrence', { id, occurrenceIndex });
    }

    public async deleteMetric(id: string): Promise<void> {
        logger.info('Deleting metric', { id });
        await this.metricRepository.deleteMetric(id);
        logger.info('Successfully deleted metric', { id });
    }

    public async getMetric(id: string): Promise<BaseMetric|undefined> {
        logger.info('Fetching metric', { id });
        const metric = await this.metricRepository.getMetric(id);
        if (!metric) {
            logger.warn('Metric not found', { id });
        }
        return metric;
    }

    public async getAllMetrics(): Promise<(BaseMetric|undefined)[]> {
        const metricEntries = await this.metricRepository.getAllMetrics();
        return Promise.all(metricEntries.map(entry => this.metricRepository.getMetric(entry.id)));
    }
}