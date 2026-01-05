# RAG Dataset Enhancement - Multi-Format File Upload Support

## 🎯 Overview

This feature adds support for multiple file formats to the LocalMind RAG (Retrieval-Augmented Generation) system, enabling users to upload and process datasets in various formats beyond the original CSV support.

## ✨ New Features

### Supported File Formats

| Format | Extension | Description | Status |
|--------|-----------|-------------|--------|
| **CSV** | `.csv` | Comma-separated values | ✅ Supported |
| **JSON** | `.json` | JSON file with Q&A pairs | ✅ **NEW** |
| **PDF** | `.pdf` | PDF documents | ✅ **NEW** |
| **TXT** | `.txt` | Plain text files | ✅ **NEW** |
| **TSV** | `.tsv` | Tab-separated values | ✅ **NEW** |
| **XLSX** | `.xlsx` | Excel spreadsheet | 🔜 Coming Soon |

## 🏗️ Architecture

### New Files Created

```
LocalMind-Backend/src/api/v1/DataSet/v1/
├── DataSet.type.ts          # TypeScript interfaces and enums (NEW)
├── DataSet.fileLoader.ts    # File loader utility for all formats (NEW)
├── DataSet.multer.ts        # Multer configuration for file uploads (NEW)
├── DataSet.validator.ts     # File validation middleware (UPDATED)
├── DataSet.controller.ts    # Updated controller with multi-format support (UPDATED)
├── DataSet.routes.ts        # Updated routes with POST endpoint (UPDATED)
├── DataSet.service.ts       # Service layer (EXISTING)
├── DataSet.utils.ts         # Utility functions (EXISTING)
└── test-samples/            # Sample test files (NEW)
    ├── sample-qa.csv
    ├── sample-qa.json
    ├── sample-qa.txt
    └── sample-qa.tsv
```

## 📦 New Dependencies

- `pdf-parse` - PDF parsing library
- `multer` - File upload middleware
- `@types/multer` - TypeScript types for multer

## 🚀 Usage

### API Endpoints

#### 1. Upload Dataset

**Endpoint:** `POST /api/v1/dataset/upload`

**Description:** Upload and process a dataset file

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field

**Example using cURL:**

```bash
# Upload CSV file
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.csv"

# Upload JSON file
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.json"

# Upload PDF file
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.pdf"

# Upload TXT file
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.txt"

# Upload TSV file
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.tsv"
```

**Example using JavaScript (Fetch API):**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:5000/api/v1/dataset/upload', {
  method: 'POST',
  body: formData
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Dataset uploaded and processed successfully (Format: JSON)",
  "data": [
    {
      "question": "What is React?",
      "answer": "React is a JavaScript library for building user interfaces..."
    }
  ]
}
```

**Response (Error):**

```json
{
  "success": false,
  "message": "No file uploaded",
  "error": null
}
```

#### 2. Get Supported Formats

**Endpoint:** `GET /api/v1/dataset/formats`

**Description:** Get list of all supported file formats

**Example:**

```bash
curl http://localhost:5000/api/v1/dataset/formats
```

**Response:**

```json
{
  "success": true,
  "message": "Supported file formats",
  "data": {
    "formats": ["csv", "xlsx", "tsv", "json", "pdf", "txt"],
    "description": {
      "csv": "Comma-separated values file",
      "xlsx": "Excel spreadsheet (not yet fully supported)",
      "tsv": "Tab-separated values file",
      "json": "JSON file with Q&A pairs",
      "pdf": "PDF document",
      "txt": "Plain text file"
    }
  }
}
```

## 📋 File Format Requirements

### CSV Format

```csv
question,answer
"What is AI?","Artificial intelligence is..."
```

### JSON Format

```json
[
  {
    "question": "What is AI?",
    "answer": "Artificial intelligence is..."
  }
]
```

### TXT Format

```text
Q: What is AI?
A: Artificial intelligence is...

Q: What is ML?
A: Machine learning is...
```

### TSV Format

```tsv
question	answer
What is AI?	Artificial intelligence is...
```

### PDF Format

Any standard PDF document. The text will be extracted and processed.

## 🔒 Validation Rules

- **Maximum file size:** 10MB
- **Minimum file size:** Must not be empty
- **Allowed extensions:** `.csv`, `.pdf`, `.txt`, `.json`, `.tsv`
- **Allowed MIME types:**
  - `text/csv`
  - `application/pdf`
  - `text/plain`
  - `application/json`
  - `text/tab-separated-values`

## 🧪 Testing

### Manual Testing

1. Start the backend server:
```bash
cd LocalMind-Backend
npm run dev
```

2. Test with sample files:
```bash
# From the test-samples directory
cd src/api/v1/DataSet/v1/test-samples

# Test CSV
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.csv"

# Test JSON
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.json"

# Test TXT
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.txt"

# Test TSV
curl -X POST http://localhost:5000/api/v1/dataset/upload \
  -F "file=@sample-qa.tsv"
```

### Using Postman

1. Open Postman
2. Create a new POST request to `http://localhost:5000/api/v1/dataset/upload`
3. Go to Body → form-data
4. Add key `file` with type `File`
5. Choose a file from test-samples
6. Send the request

## 🛠️ Code Structure

### FileLoaderUtils Class

Handles loading different file formats:

```typescript
class FileLoaderUtils {
  detectFileFormat(filename: string, mimeType?: string): FileFormat | null
  loadFile(filePath: string, format: FileFormat): Promise<Document[]>
  getFileMetadata(filePath: string): UploadedFileMetadata
}
```

### DataSetValidator Class

Validates uploaded files:

```typescript
class DataSetValidator {
  validateFileUpload(req, res, next): void
  validateFileFormat(req, res, next): void
}
```

### Updated DataSetController

```typescript
class DataSetController {
  uploadDataSet(req, res): Promise<void>  // Updated with multi-format support
  getSupportedFormats(req, res): Promise<void>  // New endpoint
}
```

## 🚨 Error Handling

The system handles various error scenarios:

- **No file uploaded:** Returns 400 error
- **File too large:** Returns 400 error with size limit info
- **Invalid file type:** Returns 400 error with allowed types
- **Empty file:** Returns 400 error
- **File processing error:** Returns 500 error with details
- **File upload cleanup:** Automatically removes uploaded files after processing or on error

## 🔄 Migration Notes

### Breaking Changes

- **Route change:** The upload endpoint changed from `GET /upload` to `POST /upload`
- **File upload required:** Now requires file upload via multipart/form-data instead of hardcoded file path

### Backward Compatibility

The old CSV functionality is fully preserved and enhanced with new formats.

## 📈 Future Enhancements

- [ ] Full Excel (.xlsx) support with xlsx library
- [ ] Support for Word documents (.docx)
- [ ] Support for markdown files (.md)
- [ ] Batch file upload
- [ ] File preview before processing
- [ ] Progress tracking for large files
- [ ] Database storage for uploaded datasets
- [ ] Dataset versioning
- [ ] Export processed data

## 🤝 Contributing

To contribute to this feature:

1. Follow the branch naming convention: `username-feature-name`
2. Test all file formats before submitting PR
3. Update documentation if adding new formats
4. Ensure TypeScript types are properly defined
5. Add error handling for edge cases

## 📝 License

This feature is part of LocalMind and follows the same license (MIT).

## 👤 Author

- **GitHub:** @yash12991
- **Branch:** `yash12991-add-pdf-txt-json-rag-support`
- **Feature:** RAG Multi-Format File Upload Support

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review test samples for format examples
