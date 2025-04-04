import { promises as fs } from 'fs';
import { BaseMetric } from '../models/metrics/BaseMetric';
import { MetricEntry } from '../models/MetricEntry';
import logger from '../utils/logger';

export class MetricRepository {
    private readonly METRICS_FILE = 'data/metrics.json';
    private readonly METRICS_DIR = 'data/metrics';

    private getMetricFilePath(id: string): string {
        return `${this.METRICS_DIR}/${id}.json`;
    }

    public async createMetric(metric: BaseMetric): Promise<BaseMetric> {
        logger.info('Creating new metric in repository');
        const metrics = await this.getAllMetrics();
        const newMetric = { ...metric, id: Math.random().toString(36).substr(2, 9) };
        const metricEntry: MetricEntry = { id: newMetric.id, name: newMetric.name, type: newMetric.type };
        logger.debug('Generated new metric', { id: newMetric.id });
        
        // Add to metrics list with initial count of 0
        metrics.push(metricEntry);
        await fs.writeFile(this.METRICS_FILE, JSON.stringify(metrics, null, 2));
        logger.debug('Updated metrics list file');
        
        // Create individual metric file
        await fs.mkdir(this.METRICS_DIR, { recursive: true });
        const metricData = { ...newMetric, occurrences: [] };
        await fs.writeFile(this.getMetricFilePath(newMetric.id), JSON.stringify(metricData, null, 2));
        logger.info('Successfully created metric in repository', { id: newMetric.id });
        
        return newMetric;
    }

    public async editMetric(id: string, metric: BaseMetric): Promise<BaseMetric> {
        logger.info('Editing metric in repository', { id });
        const metrics = await this.getAllMetrics();
        const metricIndex = metrics.findIndex(m => m.id === id);
        if (metricIndex === -1) {
            logger.error('Metric not found for editing', { id });
            throw new Error('Metric not found');
        }

        // Update metrics list
        const updatedMetricEntry: MetricEntry = { id, name: metric.name, type: metric.type };
        metrics[metricIndex] = updatedMetricEntry;
        await fs.writeFile(this.METRICS_FILE, JSON.stringify(metrics, null, 2));
        logger.debug('Updated metrics list file');

        // Update individual metric file
        logger.debug('Updating metric file', { id });
        const existingMetricData = await this.getMetric(id);
        const updatedMetricData = { ...metric, id, occurrences: existingMetricData!.occurrences };
        await fs.writeFile(this.getMetricFilePath(id), JSON.stringify(updatedMetricData, null, 2));
        logger.info('Successfully updated metric in repository', { id });

        return updatedMetricData;
    }

    public async logMetricOccurrence(id: string, occurrence: any): Promise<void> {
        logger.info('Logging metric occurrence in repository', { id });
        const metric = await this.getMetric(id);
        if (!metric) {
            logger.error('Metric not found for logging occurrence', { id });
            throw new Error('Metric not found');
        }

        const newOccurrence = { ...occurrence, date: new Date() };
        metric.occurrences.push(newOccurrence);
        await fs.writeFile(this.getMetricFilePath(id), JSON.stringify(metric, null, 2));
        logger.info('Successfully logged metric occurrence', { id, occurrenceDate: newOccurrence.date });

        // No need to update main metrics file for occurrences anymore
    }

    public async editMetricOccurrence(id: string, occurrenceId: string, occurrence: any): Promise<void> {
        logger.info('Editing metric occurrence in repository', { id, occurrenceId });
        const metric = await this.getMetric(id);
        if (!metric) {
            logger.error('Metric not found for editing occurrence', { id });
            throw new Error('Metric not found');
        }

        await fs.writeFile(this.getMetricFilePath(id), JSON.stringify(metric, null, 2));
    }

    public async deleteMetric(id: string): Promise<void> {
        logger.info('Deleting metric from repository', { id });
        const metrics = await this.getAllMetrics();
        const filteredMetrics = metrics.filter(m => m.id !== id);
        logger.debug('Updating metrics list file after deletion');
        await fs.writeFile(this.METRICS_FILE, JSON.stringify(filteredMetrics, null, 2));
        
        try {
            await fs.unlink(this.getMetricFilePath(id));
            logger.info('Successfully deleted metric file', { id });
        } catch (error) {
            logger.debug('Metric file not found during deletion', { id });
        }
    }

    public async getMetric(id: string): Promise<BaseMetric|undefined> {
        logger.debug('Reading metric file', { id });
        try {
            const data = await fs.readFile(this.getMetricFilePath(id), 'utf8');
            return JSON.parse(data);
        } catch (error) {
            logger.debug('Metric file not found', { id });
            return;
        }
    }

    public async getAllMetrics(): Promise<Array<MetricEntry>> {
        logger.debug('Reading all metrics from metrics list file');
        try {
            const data = await fs.readFile(this.METRICS_FILE, 'utf8');
            const metrics = JSON.parse(data);
            logger.debug('Successfully read metrics list', { count: metrics.length });
            return metrics;
        } catch (error: any) {
            logger.warn('Failed to read metrics list file, returning empty list', { error: error.message });
            return [];
        }
    }
}