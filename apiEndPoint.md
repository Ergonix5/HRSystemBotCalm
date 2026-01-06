










### Leave Type API end points

## View Leave Type
    GET: /api/LeaveType/{organization_object_id}

## View Leave Type by ID
    GET: /api/LeaveType/{leave_type_object_id}?organization={organization object id}

## Create Leave Type
    POST: /api/LeaveType
    BODY: {
        "leave_type_id": "lave type id",
        "organization": "oraganization  object id",
        "name": "leave type name",
        "description": "description of leave type",
        "anual_allocation": anual allocation of leave type
    }

## Update Leave Type
    PUT: /api/LeaveType/{leave_type_object_id}
    BODY: {
        "leave_type_id": "lave type id",
        "organization": "oraganization  object id",
        "name": "leave type name",
        "description": "description of leave type",
        "anual_allocation": anual allocation of leave type
    }

## Delete Leave Type
    DELETE: /api/LeaveType/{leave_type_object_id}?organization={organization object id}




### Leave Request API end points

## View Leave Request
    GET: /api/LeaveRequest/{organization_object_id}

## View Leave Request by ID
    GET: /api/LeaveRequest/{leave_request_object_id}


## Request a Leave
    POST: /api/LeaveRequest
    BODY: {
        {
            "organization": "oraganization  object id",
            "employee": "employee object id",
            "leave_type": "leave_type object id",
            "start_date": "start date of leave",
            "end_date": "end date of leave",
            "reason": "reason for leave"
        }
    }

## Leave Approve Request
    PATCH: /api/LeaveRequest/{leave_request_object_id}?userRole={admin/hr/manager}
    BODY: {
        "status": "{approved/rejected}",
        "approver_employee_id": {approver employee object id}
    }

## Leave Cancel Request
    PATCH: /api/LeaveRequest/{leave_request_object_id}
    BODY: {
        "status": "cancelled"
    }

## Leave Request Delete
    DELETE: /api/LeaveRequest/{leave_request_object_id}

