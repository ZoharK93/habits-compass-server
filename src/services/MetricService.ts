import { MetricRepository } from '../data/MetricRepository';
import { Metric } from '../models/Metric';

export class MetricService {
    private metricRepository: MetricRepository;

    constructor() {
        this.metricRepository = new MetricRepository();
    }

    public async createMetric(metric: Metric): Promise<Metric> {
        // TODO: Implement create metric logic
        return null;
    }

    public async editMetric(id: string, metric: Metric): Promise<Metric> {
        // TODO: Implement edit metric logic
        return null;
    }

    public async logMetricOccurrence(id: string, occurrence: any): Promise<void> {
        // TODO: Implement log metric occurrence logic
    }

    public async editMetricOccurrence(id: string, occurrenceId: string, occurrence: any): Promise<void> {
        // TODO: Implement edit metric occurrence logic
    }

    public async deleteMetric(id: string): Promise<void> {
        // TODO: Implement delete metric logic
    }

    public async getMetric(id: string): Promise<Metric> {
        // TODO: Implement get metric logic
        return null;
    }

    public async getAllMetrics(): Promise<Metric[]> {
        // TODO: Implement get all metrics logic
        return [];
    }
}