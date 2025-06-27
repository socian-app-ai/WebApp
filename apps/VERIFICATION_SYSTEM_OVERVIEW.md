# Society Verification System Overview

## System Architecture

This document outlines the comprehensive society verification system that has been implemented to handle verification requests from mobile/web clients and provide a robust admin interface for processing these requests.

## 📁 Files Modified/Created

### 1. Backend Schema (`backend/models/verification/verfication.model.js`)
- **Enhanced** the verification request schema to support society verification requirements
- Added support for society-specific documents (registration certificates, event pictures, advisor emails)
- Added custom document uploads with names
- Implemented verification requirements checklist
- Added admin review workflow with status tracking
- Added priority levels and processing time calculations

### 2. Society Routes (`backend/routes/university_related/society/society.route.js`)
- **Updated** the `/request-verification` endpoint to handle new schema structure
- Added validation for society ownership and permissions
- Added duplicate request prevention
- Added campus moderator fetching endpoint

### 3. Super Admin Routes (`backend/routes/super/societies.route.js`)
- **Added** comprehensive verification request management endpoints:
  - `GET /verification-requests` - List with pagination and filtering
  - `GET /verification-requests/:id` - Get single request details
  - `PUT /verification-requests/:id/approve` - Approve requests
  - `PUT /verification-requests/:id/reject` - Reject requests
  - `PUT /verification-requests/:id/review` - Mark under review
  - `PUT /verification-requests/:id/priority` - Update priority
  - `DELETE /verification-requests/:id` - Delete requests

### 4. Admin Interface (`web/beyond-the-class/src/pages/admin/sidebar_pages/verifications/SocietyVerifications.jsx`)
- **Created** a comprehensive React component for admin verification management
- Includes filtering, searching, pagination
- Real-time stats dashboard
- Modal-based request review system
- Action buttons for approve/reject/review

## 🔄 Verification Workflow

### Step 1: Request Submission (Mobile/Web)
```javascript
// From mobile app (Dart) or web interface
const verificationData = {
  societyId: "society_id",
  moderatorId: "campus_moderator_id", // Optional
  communityVoting: false,
  comments: "Additional comments",
  requirements: {
    registrationCertificate: true,
    eventPicture: true,
    advisorEmailScreenshot: false,
    moderatorRequest: true,
    communityVoting: false
  },
  societyDocuments: {
    registrationCertificate: {
      url: "document_url",
      fileName: "certificate.pdf",
      uploadedAt: "2024-01-01"
    },
    // ... other documents
    customDocuments: [
      {
        name: "Society Constitution",
        url: "constitution_url",
        fileName: "constitution.pdf"
      }
    ]
  }
}
```

### Step 2: Admin Review Process
1. **Pending** → Initial status when request is submitted
2. **Under Review** → Admin starts reviewing the request
3. **Approved** → Admin approves and society is automatically verified
4. **Rejected** → Admin rejects with reason

### Step 3: Society Update
When approved, the society's `verified` field is automatically set to `true`.

## 📊 Schema Structure

### VerificationRequest Model
```javascript
{
  // Basic entities
  society: ObjectId, // Reference to Society
  alumni: ObjectId,  // Reference to User (for alumni verification)
  
  // Documents
  societyDocuments: {
    registrationCertificate: {
      url: String,
      fileName: String,
      uploadedAt: Date
    },
    eventPicture: { /* same structure */ },
    advisorEmailScreenshot: { /* same structure */ },
    customDocuments: [{
      name: String,
      url: String,
      fileName: String,
      uploadedAt: Date
    }]
  },
  
  // Requirements checklist
  requirements: {
    registrationCertificate: Boolean,
    eventPicture: Boolean,
    advisorEmailScreenshot: Boolean,
    moderatorRequest: Boolean,
    communityVoting: Boolean
  },
  
  // Workflow
  status: ["pending", "under_review", "moderator_approved", "approved", "rejected"],
  priority: ["low", "medium", "high", "urgent"],
  
  // Review details
  adminReview: {
    reviewedAt: Date,
    reviewNotes: String,
    rejectionReason: String
  },
  
  // Relationships
  requestedBy: ObjectId,          // User who submitted
  assignedCampusModerator: ObjectId,
  approvedBySuper: ObjectId,
  rejectedBySuper: ObjectId,
  
  // Metadata
  submittedAt: Date,
  lastUpdated: Date,
  communityVoting: Boolean,
  comments: String
}
```

## 🛠 API Endpoints

### User Endpoints (Society Members)
```bash
POST /api/society/request-verification
GET /api/society/campus-moderators
```

### Super Admin Endpoints
```bash
GET    /api/super/societies/verification-requests
GET    /api/super/societies/verification-requests/:id
PUT    /api/super/societies/verification-requests/:id/approve
PUT    /api/super/societies/verification-requests/:id/reject
PUT    /api/super/societies/verification-requests/:id/review
PUT    /api/super/societies/verification-requests/:id/priority
DELETE /api/super/societies/verification-requests/:id
```

## 🔍 Admin Interface Features

### Dashboard Stats
- Pending requests count
- Under review count
- Approved count
- Rejected count

### Filtering & Search
- Filter by status (pending, under_review, approved, rejected)
- Filter by priority (low, medium, high, urgent)
- Filter by type (society, alumni)
- Text search in comments and review notes
- Pagination support

### Request Management
- **View Details**: Complete request information including society details, requirements, and documents
- **Approve**: Mark request as approved with optional review notes
- **Reject**: Reject request with mandatory rejection reason
- **Mark Under Review**: Change status to under review
- **Priority Updates**: Change priority level (low/medium/high/urgent)

### Modal Interface
- Comprehensive request details view
- Society information display
- Verification requirements checklist
- Action forms for approve/reject/review
- Document preview capabilities (planned)

## 🔐 Security & Permissions

### Request Submission
- Only society moderators or creators can submit verification requests
- Prevents duplicate requests for the same society
- Validates society existence and user permissions

### Admin Actions
- All admin actions require super admin authentication
- Audit trail through admin review fields
- Status change validation prevents invalid transitions

## 📱 Mobile Integration

The system is designed to work seamlessly with the Flutter mobile app (`SocietyVerification.dart`) which provides:
- Document upload interface
- Requirements checklist
- Campus moderator selection
- Community voting options
- Custom document management

## 🚀 Future Enhancements

### Planned Features
1. **Document Preview**: Direct document viewing in admin interface
2. **Email Notifications**: Automatic notifications for status changes
3. **Community Voting**: Implementation of community-based verification
4. **Bulk Actions**: Approve/reject multiple requests at once
5. **Advanced Analytics**: Verification metrics and reporting
6. **File Upload Integration**: Direct file upload through admin interface

### Performance Optimizations
1. **Redis Caching**: Cache frequently accessed verification data
2. **Database Indexing**: Optimize queries with proper indexes
3. **Image Optimization**: Compress and optimize uploaded documents
4. **Background Processing**: Queue-based document processing

## 📖 Usage Instructions

### For Society Members
1. Navigate to society verification page in mobile app
2. Fill required information and upload documents
3. Submit verification request
4. Track status through notifications

### For Super Admins
1. Access admin panel → Society Verifications
2. Review pending requests using filters
3. Click on request to view details
4. Use action buttons to approve/reject/review
5. Add review notes for transparency

## 🔧 Configuration

### Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/beyond-the-class

# File Storage (if using cloud storage)
AWS_S3_BUCKET=verification-documents
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key

# Email Service (for notifications)
EMAIL_SERVICE_API_KEY=your-email-api-key
```

### Required Dependencies
```json
{
  "backend": [
    "mongoose",
    "express",
    "multer",
    "aws-sdk"
  ],
  "frontend": [
    "react",
    "axios",
    "lucide-react",
    "tailwindcss"
  ]
}
```

This verification system provides a robust, scalable solution for managing society verification requests with a comprehensive admin interface and seamless mobile integration. 