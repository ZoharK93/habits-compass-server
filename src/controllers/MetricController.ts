import { Request, Response } from 'express';
import logger from '../utils/logger';
import { MetricService } from '../services/MetricService';
import { MetricType, BaseMetric } from '../models/metrics/BaseMetric';
import { MetricValidator } from '../services/MetricValidator';

export class MetricController {
    private metricService: MetricService;

    constructor() {
        this.metricService = new MetricService();
    }

    public async createMetric(req: Request, res: Response): Promise<void> {
        logger.info('Received create metric request');
        try {
            const { type, ...metricData } = req.body;
            logger.debug('Create metric request body', { type, metricData });
            
            if (!type || !Object.values(MetricType).includes(type)) {
                res.status(400).json({ error: 'Invalid or missing metric type' });
                return;
            }

            const metric: BaseMetric = {
                type,
                ...metricData
            };

            if (!MetricValidator.validateMetric(metric)) {
                res.status(400).json({ error: 'Invalid metric data' });
                return;
            }

            const createdMetric = await this.metricService.createMetric(metric);
            logger.info('Metric created successfully', { id: createdMetric.id });
            res.status(201).json(createdMetric);
        } catch (error: any) {
            logger.error('Error creating metric', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async editMetric(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        logger.info('Received edit metric request', { id });
        try {
            const { type, ...metricData } = req.body;
            logger.debug('Edit metric request body', { id, type, metricData });

            if (!type || !Object.values(MetricType).includes(type)) {
                res.status(400).json({ error: 'Invalid or missing metric type' });
                return;
            }

            const metric: BaseMetric = {
                type,
                ...metricData
            };

            if (!MetricValidator.validateMetric(metric)) {
                res.status(400).json({ error: 'Invalid metric data' });
                return;
            }

            const updatedMetric = await this.metricService.editMetric(id, metric);
            logger.info('Metric updated successfully', { id });
            res.status(200).json(updatedMetric);
        } catch (error: any) {
            logger.error('Error editing metric', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async logMetricOccurrence(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const occurrence = req.body;
            
            const metric = await this.metricService.getMetric(id);
            if (!metric) {
                res.status(404).json({ error: 'Metric not found' });
                return;
            }

            if (!MetricValidator.validateMetricOccurrence(metric.type, occurrence)) {
                res.status(400).json({ error: 'Invalid occurrence data' });
                return;
            }

            await this.metricService.logMetricOccurrence(id, occurrence);
            res.status(200).json({ message: 'Occurrence logged successfully' });
        } catch (error: any) {
            logger.error('Error logging metric occurrence', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async editMetricOccurrence(req: Request, res: Response): Promise<void> {
        try {
            const { id, occurrenceIndex } = req.params;
            const occurrence = req.body;
            
            const metric = await this.metricService.getMetric(id);
            if (!metric) {
                res.status(404).json({ error: 'Metric not found' });
                return;
            }

            if (!MetricValidator.validateMetricOccurrence(metric.type, occurrence)) {
                res.status(400).json({ error: 'Invalid occurrence data' });
                return;
            }

            await this.metricService.editMetricOccurrence(id, parseInt(occurrenceIndex), occurrence);
            res.status(200).json({ message: 'Occurrence updated successfully' });
        } catch (error: any) {
            logger.error('Error editing metric occurrence', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async deleteMetric(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.metricService.deleteMetric(id);
            res.status(204).send();
        } catch (error: any) {
            logger.error('Error deleting metric', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getMetric(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const metric = await this.metricService.getMetric(id);
            
            if (!metric) {
                res.status(404).json({ error: 'Metric not found' });
                return;
            }
            
            res.status(200).json(metric);
        } catch (error: any) {
            logger.error('Error getting metric', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    public async getAllMetrics(req: Request, res: Response): Promise<void> {
        try {
            const metrics = await this.metricService.getAllMetrics();
            res.status(200).json(metrics);
        } catch (error: any) {
            logger.error('Error getting all metrics', { error: error.message });
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}