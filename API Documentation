## Endpoints

### Create a Todo

**POST** `/api/todos`

**Request Body:**

```json
{
  "title": "Finish project",
  "description": "Finalize the ABP task",
  "status": "Pending",
  "priority": "High",
  "dueDate": "2025-05-15T00:00:00Z"
}

Validation:
title: Required, max 100 characters
status: Enum - Pending, InProgress, Completed
priority: Enum - Low, Medium, High


📄 Get All Todos
GET /api/todos

Query Parameters:
status: (optional) Filter by status
priority: (optional) Filter by priority

🔍 Get a Todo by ID
GET /api/todos/{id}

✏️ Update a Todo
PUT /api/todos/{id}
Request Body: (Same structure as Create)

❌ Delete a Todo
DELETE /api/todos/{id}

✅ Mark a Todo as Completed
GET /api/todos/{id}/complete
No request body required.

Error Handling
All errors follow this structure:
{
  "error": {
    "code": "ValidationError",
    "message": "The Title field is required."
  }
}


