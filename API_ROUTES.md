# API Routes Documentation

## Metrics API Endpoints

### Create Metric
- **POST** `/metrics`
- Request body must include `type` property and metric-specific data
- Validates metric type and data structure
- Returns 201 Created with the created metric

### Edit Metric
- **PUT** `/metrics/:id`
- Request body must include `type` property and updated metric data
- Validates metric type and data structure
- Returns 200 OK with the updated metric

### Log Metric Occurrence
- **POST** `/metrics/:id/occurrences`
- Request body contains occurrence data specific to the metric type
- Validates occurrence data structure
- Returns 200 OK with success message

### Edit Metric Occurrence
- **PUT** `/metrics/:id/occurrences/:occurrenceIndex`
- Request body contains updated occurrence data
- Validates occurrence data structure
- Returns 200 OK with success message

### Delete Metric
- **DELETE** `/metrics/:id`
- Deletes the metric and all its occurrences
- Returns 204 No Content

### Get Metric
- **GET** `/metrics/:id`
- Retrieves a specific metric by ID
- Returns 200 OK with the metric data or 404 Not Found

### Get All Metrics
- **GET** `/metrics`
- Retrieves all metrics
- Returns 200 OK with array of metrics

## Data Validation

All endpoints validate:
1. Metric type (must be one of the defined MetricType enum values)
2. Metric-specific data structure based on the type
3. Occurrence data structure based on the metric type

## Error Responses

- 400 Bad Request: Invalid input data
- 404 Not Found: Metric not found
- 500 Internal Server Error: Server-side errors