# System Logging Usage Guide

This guide explains how to use the `logAction` function to record user activities in the system.

## Overview

The `logAction` function automatically captures:
- User ID
- User Name (First Name + Last Name)
- Role
- Organization ID

You only need to provide:
1.  **Action Name**: A string describing what happened.
2.  **Details**: An object with relevant data.

## Usage

### 1. Import `logAction`

```typescript
import { logAction } from "@/lib/logger";
```

### 2. Call `logAction` in your Server Actions or Route Handlers

#### Example: Creating an Organization

```typescript
// src/app/actions/organization.ts

import { logAction } from "@/lib/logger";
import { dbConnectMarketPlace } from "@/lib/db";
import Organization from "@/models/organization";

export async function createOrganization(formData: FormData) {
  // ... existing validation and logic ...
  
  const orgName = formData.get("name");
  
  // Create the organization in DB
  await dbConnectMarketPlace();
  const newOrg = await Organization.create({ name: orgName });

  // LOG THE ACTION
  // No need to pass userId, it's fetched from the session automatically
  await logAction("CREATE_ORGANIZATION", {
    organizationId: newOrg._id,
    organizationName: newOrg.name,
    timestamp: new Date()
  });

  return { success: true };
}
```

#### Example: Updating User Profile

```typescript
// src/app/api/user/update/route.ts

import { NextResponse } from "next/server";
import { logAction } from "@/lib/logger";

export async function POST(req: Request) {
  const body = await req.json();
  
  // ... logic to update user ...

  // Log the update
  await logAction("UPDATE_PROFILE", {
    updatedFields: Object.keys(body),
    status: "Success"
  });

  return NextResponse.json({ success: true });
}
```

## Data Stored

When you call `logAction('TEST_ACTION', { foo: 'bar' })`, the database entry will look like:

```json
{
  "_id": "...",
  "userId": "651...",       // From Token
  "username": "John Doe",   // From Token (first_name + last_name)
  "role": "admin",          // From Token
  "orgId": "org_123...",    // From Token
  "action": "TEST_ACTION",  // Passed Argument
  "details": {              // Passed Argument
    "foo": "bar"
  },
  "createdAt": "2023-10-27T10:00:00.000Z"
}
```

## Advanced Usage: Manual User Context

In some cases, like during **Login** or **Registration**, the session cookies are not yet set on the request. You can manually pass the user context as the 3rd argument.

```typescript
// src/app/api/auth/login/route.ts
await logAction(
  "USER_LOGIN", 
  { method: "email" }, 
  { 
    sub: user._id, 
    first_name: user.first_name, 
    last_name: user.last_name, 
    role: user.role, 
    orgId: user.organization 
  }
);
```

## Best Practices

- **Action Names**: Use uppercase snake_case (e.g., `USER_LOGIN`, `ORDER_CREATED`, `DELETE_ITEM`) for consistency.
- **Details**: Keep the `details` object minimal but informative. Don't dump huge objects if not necessary.
- **Error Handling**: `logAction` swallows errors so it won't break your main application flow if the logging DB is down.
