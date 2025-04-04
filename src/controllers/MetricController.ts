import { Request, Response } from 'express';
import { MetricService } from '../services/MetricService';

export class MetricController {
    private metricService: MetricService;

    constructor() {
        this.metricService = new MetricService();
    }

    public async createMetric(req: Request, res: Response): Promise<void> {
        // TODO: Implement create metric logic
    }

    public async editMetric(req: Request, res: Response): Promise<void> {
        // TODO: Implement edit metric logic
    }

    public async logMetricOccurrence(req: Request, res: Response): Promise<void> {
        // TODO: Implement log metric occurrence logic
    }

    public async editMetricOccurrence(req: Request, res: Response): Promise<void> {
        // TODO: Implement edit metric occurrence logic
    }

    public async deleteMetric(req: Request, res: Response): Promise<void> {
        // TODO: Implement delete metric logic
    }

    public async getMetric(req: Request, res: Response): Promise<void> {
        // TODO: Implement get metric logic
    }

    public async getAllMetrics(req: Request, res: Response): Promise<void> {
        // TODO: Implement get all metrics logic
    }
}