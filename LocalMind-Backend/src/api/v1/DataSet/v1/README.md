# AI Training Data Management (Issue #59)

This module provides a complete pipeline for managing AI training data, supporting both manual entry and bulk dataset uploads.

## Features
- **Manual Entry**: Create, update, and delete training samples with automated embedding generation.
- **Dataset Upload**: Support for PDF, CSV, Excel (.xlsx), JSON, TXT, and Markdown (.md).
- **Automated Processing**: Background parsing of uploaded files into structured training samples.
- **Semantic Search**: Vector-based search to find the most relevant training data for a given query.

## API Reference

### Training Samples (CRUD)
- `POST /api/v1/training-samples`: Create a new sample.
- `GET /api/v1/training-samples`: List samples with filters (`type`, `tags`, `isActive`, `sourceType`).
- `GET /api/v1/training-samples/:id`: Get a specific sample.
- `PUT /api/v1/training-samples/:id`: Update a sample (re-generates embedding if the question changes).
- `DELETE /api/v1/training-samples/:id`: Soft delete (sets `isActive: false`).

### Semantic Search
- `POST /api/v1/training-samples/search`
  ```json
  {
    "query": "How do I reset my password?",
    "topK": 5,
    "filters": { "type": "faq" }
  }
  ```

### Dataset Management
- `POST /api/v1/training-datasets/upload`: Upload a file (form-data key: `dataset`).
- `POST /api/v1/training-datasets/:id/process`: Trigger background processing of the uploaded file.

## Example `answerTemplate` JSON
```json
{
  "greeting": "Hello! Here is the information you requested.",
  "answer": "To reset your password, go to the settings page and click 'Forgot Password'.",
  "sections": [
    { "title": "Step 1", "content": "Navigate to Settings." },
    { "title": "Step 2", "content": "Click on Security." }
  ],
  "suggestions": ["How to change email?", "Two-factor authentication"]
}
```

## Setup Requirements
1. **MongoDB Vector Index**: Ensure a vector index named `vector` is created on the `trainingsamples` collection for the `embedding` field.
2. **Ollama/AI Provider**: The system uses the project's configured AI provider to generate embeddings. Ensure the service is running.
