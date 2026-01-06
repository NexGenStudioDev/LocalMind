# AI Training Data Management (Issue #59)

This module provides a robust pipeline for managing AI training data, supporting manual entries and multi-format dataset uploads. It automates embedding generation and enables high-performance semantic search using MongoDB Atlas Vector Search.

## 🎯 Features

- **Manual Training Entry**: Create structured Q&A pairs with custom metadata and auto-generated vectors.
- **Bulk Dataset Support**: Upload and process `PDF`, `CSV`, `Excel (.xlsx)`, `JSON`, `TXT`, and `Markdown (.md)`.
- **Intelligent Streaming Parser**: Process large files row-by-row using Node.js streams to maintain low memory footprints.
- **Semantic Search**: Full-text semantic search using vector embeddings (768 dimensions) to find relevant training context.
- **Dynamic Answer Templates**: Support for rich responses including greetings, sections, and follow-up suggestions.

---

## 🛠️ API Documentation

### 1. Training Samples (Manual CRUD)

#### **Create Training Sample**

- **Method**: `POST`
- **Route**: `/api/v1/training-samples`
- **Description**: Creates a new training entry and generates a vector embedding for it.
- **Example Request**:

```json
{
  "question": "What is LocalMind?",
  "type": "faq",
  "answerTemplate": {
    "greeting": "Hi there!",
    "answer": "LocalMind is an open-source AI platform.",
    "sections": [{ "title": "Overview", "content": "It allows local LLM execution." }],
    "suggestions": ["How to install?", "Supported models"]
  },
  "tags": ["intro", "help"],
  "language": "en"
}
```

- **Example Response**:

```json
{
  "success": true,
  "message": "Training sample created successfully",
  "data": {
    "_id": "658a...",
    "question": "What is LocalMind?",
    "isActive": true,
    "sourceType": "manual",
    "embedding": [0.12, -0.45, ...],
    "createdAt": "2024-01-05T..."
  }
}
```

#### **List Training Samples (Paginated)**

- **Method**: `GET`
- **Route**: `/api/v1/training-samples`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `type`: Filter by type (qa, snippet, etc.)
  - `isActive`: Boolean string ('true'/'false')
  - `sourceType`: 'manual' or 'dataset'
- **Data Paged**:
  - `data`: Array of samples (excluding large embedding vectors for performance).
  - `total`: Total records matching filter.
  - `page`: Current page.
  - `limit`: Items per page.
  - `totalPages`: Total pages available.

---

### 2. Semantic Vector Search

#### **Search Training Data**

- **Method**: `POST`
- **Route**: `/api/v1/training-samples/search`
- **Description**: Finds the top K most semantically similar training samples for a given query.
- **Example Request**:

```json
{
  "query": "how to setup local models?",
  "topK": 3,
  "filters": { "isActive": true }
}
```

- **Example Response**:

```json
{
  "success": true,
  "data": [
    {
      "question": "How do I configure Ollama?",
      "answerTemplate": { "answer": "Set OLLAMA_HOST in your env..." },
      "score": 0.985
    }
  ]
}
```

---

### 3. Dataset File Management

#### **Upload Dataset File**

- **Method**: `POST`
- **Route**: `/api/v1/training-datasets/upload`
- **Content-Type**: `multipart/form-data`
- **Payload**: `dataset` (File)
- **Supported Formats**: `.pdf`, `.csv`, `.xlsx`, `.json`, `.txt`, `.md`

#### **Process Dataset**

- **Method**: `POST`
- **Route**: `/api/v1/training-datasets/:id/process`
- **Description**: Triggers the background worker to parse the file, generate embeddings, and create training samples.

---

## 🗄️ Database Schema & Important Notes

- **Vector Index**: To enable `vectorSearch`, a Search Index must be created in MongoDB Atlas:
  ```json
  {
    "fields": [
      {
        "numDimensions": 768,
        "path": "embedding",
        "similarity": "cosine",
        "type": "vector"
      }
    ]
  }
  ```
- **Soft Deletes**: Use `DELETE /api/v1/training-samples/:id` to set `isActive: false`. We avoid hard deletes to preserve historical training context.
- **Environment Config**:
  - `MAX_FILE_SIZE`: Configurable file upload limit (default 10MB).
  - `OLLAMA_HOST`: Base URL for the embedding generation service.

---
