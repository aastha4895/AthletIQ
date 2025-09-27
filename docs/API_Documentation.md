# AthletIQ API Documentation

## Base URL
```
https://api.athletiq.sai.gov.in/api
```

## Authentication
All API requests require authentication using JWT tokens in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new athlete account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "1995-05-15",
  "gender": "male",
  "phoneNumber": "+91-9876543210"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "athlete"
  }
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Assessments

#### POST /assessments
Submit a new assessment for processing.

**Request Body:**
```json
{
  "testType": "Vertical Jump",
  "videoUrl": "https://s3.amazonaws.com/athletiq-videos/video123.mp4",
  "videoMetadata": {
    "duration": 30,
    "fileSize": 15728640,
    "resolution": "1920x1080",
    "format": "mp4"
  }
}
```

**Response:**
```json
{
  "message": "Assessment submitted successfully",
  "assessmentId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "status": "processing"
}
```

#### GET /assessments
Get user's assessments with pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `testType` (optional): Filter by test type
- `status` (optional): Filter by status

**Response:**
```json
{
  "assessments": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "testType": "Vertical Jump",
      "aiAnalysis": {
        "metrics": {
          "jumpHeight": 65,
          "takeoffTime": 0.35,
          "landingStability": "Good"
        },
        "score": "Excellent",
        "confidence": 0.92
      },
      "status": "completed",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 47,
    "itemsPerPage": 10
  }
}
```

#### GET /assessments/:id
Get specific assessment details.

#### POST /assessments/:id/submit-to-sai
Submit assessment to SAI for official review.

### Users

#### GET /auth/profile
Get current user profile.

#### PUT /auth/profile
Update user profile information.

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "code": "ERROR_CODE"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting
API requests are limited to 100 requests per 15-minute window per IP address.

## Video Upload Guidelines

### Supported Formats
- MP4 (recommended)
- MOV
- AVI

### File Size Limits
- Maximum file size: 100MB
- Recommended duration: 30 seconds to 5 minutes

### Quality Requirements
- Minimum resolution: 720p
- Frame rate: 30fps or higher
- Good lighting conditions
- Clear view of the athlete

## AI Analysis Metrics

### Vertical Jump
- `jumpHeight`: Height in centimeters
- `takeoffTime`: Time to takeoff in seconds
- `landingStability`: Qualitative assessment
- `explosivePower`: Calculated power metric

### Shuttle Run
- `totalTime`: Total completion time in seconds
- `turnaroundCount`: Number of direction changes
- `averageSpeed`: Speed in m/s
- `agility`: Agility score (0-100)

### Sit-ups
- `repCount`: Number of repetitions
- `formQuality`: Form assessment (Good/Poor)
- `cadence`: Repetitions per second
- `coreStrength`: Calculated strength metric

### Endurance Run
- `distance`: Distance covered in meters
- `time`: Total time in seconds
- `pace`: Pace in seconds per kilometer
- `vo2MaxEstimate`: Estimated VO2 Max

### Height & Weight
- `height`: Height in centimeters
- `estimatedWeight`: Weight in kilograms
- `bmi`: Body Mass Index
- `bodyComposition`: Assessment category

## Webhooks

AthletIQ can send webhooks for important events:

### Assessment Completed
```json
{
  "event": "assessment.completed",
  "data": {
    "assessmentId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "testType": "Vertical Jump",
    "score": "Excellent",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Cheat Detection Alert
```json
{
  "event": "cheat.detected",
  "data": {
    "assessmentId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "userId": "60f7b3b3b3b3b3b3b3b3b3b4",
    "anomalies": ["Potential video manipulation detected"],
    "severity": "high",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```