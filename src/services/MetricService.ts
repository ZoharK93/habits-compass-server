import { MetricRepository } from '../data/MetricRepository';
import { MetricValidator } from './MetricValidator';
import { MetricType, BaseMetric, Occurrence } from '../models/metrics/BaseMetric';
import { MetricEntry } from '../models/MetricEntry';

export class MetricService {
    private metricRepository: MetricRepository;

    constructor() {
        this.metricRepository = new MetricRepository();
    }

    public async createMetric(metric: BaseMetric): Promise<BaseMetric> {
        if (!MetricValidator.validateMetric(metric)) {
            throw new Error('Invalid metric data');
        }
        return await this.metricRepository.createMetric(metric);
    }

    public async editMetric(id: string, metric: BaseMetric): Promise<BaseMetric> {
        if (!MetricValidator.validateMetric(metric)) {
            throw new Error('Invalid metric data');
        }
        return await this.metricRepository.editMetric(id, metric);
    }

    public async logMetricOccurrence(id: string, occurrence: Occurrence): Promise<void> {
        const metric = await this.getMetric(id);
        if (!metric) {
            throw new Error('Metric not found');
        }
        
        // Add the occurrence to the metric
        metric.occurrences = [...metric.occurrences, occurrence];
        
        // Validate the updated metric
        if (!MetricValidator.validateMetric(metric)) {
            throw new Error('Invalid occurrence data');
        }
        
        await this.metricRepository.editMetric(id, metric);
    }

    public async editMetricOccurrence(id: string, occurrenceIndex: number, occurrence: Occurrence): Promise<void> {
        const metric = await this.getMetric(id);
        if (!metric) {
            throw new Error('Metric not found');
        }
        if (occurrenceIndex < 0 || occurrenceIndex >= metric.occurrences.length) {
            throw new Error('Invalid occurrence index');
        }
        
        // Update the occurrence
        metric.occurrences[occurrenceIndex] = occurrence;
        
        // Validate the updated metric
        if (!MetricValidator.validateMetric(metric)) {
            throw new Error('Invalid occurrence data');
        }
        
        await this.metricRepository.editMetric(id, metric);
    }

    public async deleteMetric(id: string): Promise<void> {
        await this.metricRepository.deleteMetric(id);
    }

    public async getMetric(id: string): Promise<BaseMetric> {
        return await this.metricRepository.getMetric(id);
    }

    public async getAllMetrics(): Promise<BaseMetric[]> {
        const metricEntries = await this.metricRepository.getAllMetrics();
        return Promise.all(metricEntries.map(entry => this.metricRepository.getMetric(entry.id)));
    }
}