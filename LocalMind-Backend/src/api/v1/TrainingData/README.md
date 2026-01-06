# AI Training Data Management System

A comprehensive system for managing AI training data with support for manual entry, dataset uploads, automatic embedding generation, and vector similarity search.

## Features

### 1. Manual Training Sample Entry
- Structured answer templates with sections and suggestions
- Support for multiple sample types: QA, snippet, doc, FAQ, other
- Optional code snippets
- Tagging and language support
- Automatic embedding generation on creation

### 2. Dataset Upload & Processing
- **Supported Formats**: CSV, Excel (.xlsx), JSON, TXT, Markdown (.md), PDF
- File validation and storage with unique naming
- Preview functionality before processing
- Batch processing with progress tracking
- Automatic training sample generation from parsed data

### 3. Vector Embeddings
- Google's text-embedding-004 model integration
- Automatic embedding generation for all training samples
- Cosine similarity calculation
- Top-K similarity search with filtering

## API Endpoints

### Training Samples

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/training-samples` | Create a new training sample |
| GET | `/api/v1/training-samples` | Get all samples with filters |
| GET | `/api/v1/training-samples/stats` | Get statistics |
| GET | `/api/v1/training-samples/:id` | Get single sample |
| PUT | `/api/v1/training-samples/:id` | Update a sample |
| DELETE | `/api/v1/training-samples/:id` | Delete a sample (soft delete) |
| POST | `/api/v1/training-samples/search` | Vector similarity search |

### Datasets

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/training-datasets/upload` | Upload a dataset file |
| GET | `/api/v1/training-datasets` | Get all datasets |
| GET | `/api/v1/training-datasets/stats` | Get dataset statistics |
| GET | `/api/v1/training-datasets/:id` | Get single dataset |
| GET | `/api/v1/training-datasets/:id/preview` | Preview parsed content |
| POST | `/api/v1/training-datasets/:id/process` | Process dataset into samples |
| DELETE | `/api/v1/training-datasets/:id` | Delete dataset |

## Example Usage

### Create Manual Training Sample

```bash
curl -X POST http://localhost:5000/api/v1/training-samples \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How do I reset my password?",
    "type": "faq",
    "answerTemplate": {
      "greeting": "I would be happy to help you reset your password!",
      "answer": "To reset your password, click on the Forgot Password link on the login page. Enter your email address, and we will send you a reset link.",
      "sections": [
        {
          "title": "Steps",
          "content": "1. Go to login page\n2. Click Forgot Password\n3. Enter your email\n4. Check your inbox"
        }
      ],
      "suggestions": [
        "Change email address",
        "Enable 2FA",
        "Contact support"
      ]
    },
    "tags": ["password", "account", "security"],
    "language": "en"
  }'
```

### Answer Template JSON Structure

```json
{
  "greeting": "Optional welcome message",
  "answer": "The main answer text (required)",
  "sections": [
    {
      "title": "Section Title",
      "content": "Detailed content for this section"
    }
  ],
  "suggestions": [
    "Related topic 1",
    "Related topic 2"
  ]
}
```

### Upload Dataset

```bash
curl -X POST http://localhost:5000/api/v1/training-datasets/upload \
  -F "file=@training_data.csv"
```

### Process Dataset

```bash
curl -X POST http://localhost:5000/api/v1/training-datasets/60a1b2c3d4e5f6g7h8i9j0/process
```

### Vector Search

```bash
curl -X POST http://localhost:5000/api/v1/training-samples/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How to reset password?",
    "topK": 5,
    "filters": {
      "type": "faq",
      "isActive": true
    }
  }'
```

## Dataset File Formats

### CSV Format
```csv
question,answer,type,tags
"What is LocalMind?","LocalMind is an AI assistant...","qa","ai,assistant"
"How to install?","Run npm install...","doc","installation"
```

### JSON Format
```json
[
  {
    "question": "What is LocalMind?",
    "answer": "LocalMind is an AI assistant...",
    "type": "qa",
    "tags": ["ai", "assistant"]
  }
]
```

### Excel Format
| question | answer | type | tags |
|----------|--------|------|------|
| What is LocalMind? | LocalMind is an AI... | qa | ai,assistant |

### TXT Format
```
Q: What is LocalMind?

A: LocalMind is an AI assistant that helps you with various tasks.

Q: How to install?

A: Run npm install in the project directory.
```

### Markdown Format
```markdown
# What is LocalMind?

LocalMind is an AI assistant that helps you with various tasks.

# How to Install

Run `npm install` in the project directory.
```

## Environment Variables

Add the following to your `.env` file:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

## Database Schemas

### TrainingSample
- `question` - The question or prompt
- `type` - qa | snippet | doc | faq | other
- `answerTemplate` - Structured answer with sections
- `codeSnippet` - Optional code example
- `embedding` - Vector embedding for search
- `sourceType` - manual | dataset
- `datasetId` - Reference to source dataset
- `tags` - Array of tags
- `language` - Language code
- `isActive` - Active/inactive status

### DatasetFile
- `originalName` - Original filename
- `storedName` - UUID-based stored name
- `filePath` - Path to stored file
- `mimeType` - File MIME type
- `sizeInBytes` - File size
- `fileType` - pdf | csv | excel | json | txt | md
- `status` - uploaded | processing | completed | failed
- `totalSamplesGenerated` - Count of generated samples
- `errorMessage` - Error details if failed

## Frontend Pages

The feature includes a React-based frontend with:
- **Manual Entry Form** - Create training samples manually
- **Dataset Upload** - Upload and process files
- **Samples List** - View, filter, and search samples

Access the Training Data Management page at: `/training-data`
