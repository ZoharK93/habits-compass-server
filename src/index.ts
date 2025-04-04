import express from 'express';
import { MetricController } from './controllers/MetricController';

const app = express();
const port = 3000;

app.use(express.json());

const metricController = new MetricController();

// Routes
app.post('/metrics', (req, res) => metricController.createMetric(req, res));
app.put('/metrics/:id', (req, res) => metricController.editMetric(req, res));
app.post('/metrics/:id/occurrences', (req, res) => metricController.logMetricOccurrence(req, res));
app.put('/metrics/:id/occurrences/:occurrenceId', (req, res) => metricController.editMetricOccurrence(req, res));
app.delete('/metrics/:id', (req, res) => metricController.deleteMetric(req, res));
app.get('/metrics/:id', (req, res) => metricController.getMetric(req, res));
app.get('/metrics', (req, res) => metricController.getAllMetrics(req, res));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});