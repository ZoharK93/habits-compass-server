import { promises as fs } from 'fs';
import { Metric } from '../models/Metric';
import { MetricEntry } from '../models/MetricEntry';

export class MetricRepository {
    private readonly METRICS_FILE = 'data/metrics.json';
    private readonly METRICS_DIR = 'data/metrics';

    private getMetricFilePath(id: string): string {
        return `${this.METRICS_DIR}/${id}.json`;
    }

    public async createMetric(metric: Metric): Promise<Metric> {
        const metrics = await this.getAllMetrics();
        const newMetric = { ...metric, id: Math.random().toString(36).substr(2, 9) };
        const metricEntry: MetricEntry = { id: newMetric.id, name: newMetric.name, type: newMetric.type };
        
        // Add to metrics list with initial count of 0
        metrics.push(metricEntry);
        await fs.writeFile(this.METRICS_FILE, JSON.stringify(metrics, null, 2));
        
        // Create individual metric file
        await fs.mkdir(this.METRICS_DIR, { recursive: true });
        const metricData = { ...newMetric, occurrences: [] };
        await fs.writeFile(this.getMetricFilePath(newMetric.id), JSON.stringify(metricData, null, 2));
        
        return newMetric;
    }

    public async editMetric(id: string, metric: Metric): Promise<Metric> {
        const metrics = await this.getAllMetrics();
        const metricIndex = metrics.findIndex(m => m.id === id);
        if (metricIndex === -1) throw new Error('Metric not found');

        // Update metrics list
        const updatedMetricEntry: MetricEntry = { id, name: metric.name, type: metric.type };
        metrics[metricIndex] = updatedMetricEntry;
        await fs.writeFile(this.METRICS_FILE, JSON.stringify(metrics, null, 2));

        // Update individual metric file
        const existingMetricData = await this.getMetric(id);
        const updatedMetricData = { ...metric, id, occurrences: existingMetricData.occurrences };
        await fs.writeFile(this.getMetricFilePath(id), JSON.stringify(updatedMetricData, null, 2));

        return updatedMetricData;
    }

    public async logMetricOccurrence(id: string, occurrence: any): Promise<void> {
        const metric = await this.getMetric(id);
        if (!metric) throw new Error('Metric not found');

        metric.occurrences.push({ ...occurrence, date: new Date() });
        await fs.writeFile(this.getMetricFilePath(id), JSON.stringify(metric, null, 2));

        // No need to update main metrics file for occurrences anymore
    }

    public async editMetricOccurrence(id: string, occurrenceId: string, occurrence: any): Promise<void> {
        const metric = await this.getMetric(id);
        if (!metric) throw new Error('Metric not found');

        const occurrenceIndex = metric.occurrences.findIndex(o => o.id === occurrenceId);
        if (occurrenceIndex === -1) throw new Error('Occurrence not found');

        metric.occurrences[occurrenceIndex] = { ...occurrence, id: occurrenceId };
        await fs.writeFile(this.getMetricFilePath(id), JSON.stringify(metric, null, 2));
    }

    public async deleteMetric(id: string): Promise<void> {
        const metrics = await this.getAllMetrics();
        const filteredMetrics = metrics.filter(m => m.id !== id);
        await fs.writeFile(this.METRICS_FILE, JSON.stringify(filteredMetrics, null, 2));
        
        try {
            await fs.unlink(this.getMetricFilePath(id));
        } catch (error) {
            // Ignore if file doesn't exist
        }
    }

    public async getMetric(id: string): Promise<Metric> {
        try {
            const data = await fs.readFile(this.getMetricFilePath(id), 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    public async getAllMetrics(): Promise<Array<MetricEntry>> {
        try {
            const data = await fs.readFile(this.METRICS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}