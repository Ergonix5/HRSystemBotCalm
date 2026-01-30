/**
 * Test Script for Notification System
 * 
 * This script helps you test the notification API endpoints
 * Run this in your browser console or create a test page
 */

// Configuration - UPDATE THESE VALUES
const CONFIG = {
    baseUrl: 'http://localhost:3000',
    organizationId: '69426e67f7ac33645aad354c',  // Replace with actual organization ID
    recipientId: '695b9acd28d36d419270cd2e', // Replace with actual employee ID
    cronSecret: 'change-this-secret-in-production', // From your .env
};

// Helper function to make API calls
async function apiCall(method, endpoint, body = null, queryParams = {}) {
    const url = new URL(`${CONFIG.baseUrl}${endpoint}`);

    // Add query parameters
    Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== null && queryParams[key] !== undefined) {
            url.searchParams.append(key, queryParams[key]);
        }
    });

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url.toString(), options);
        const data = await response.json();

        console.log(`✅ ${method} ${endpoint}:`, {
            status: response.status,
            data
        });

        return { success: response.ok, status: response.status, data };
    } catch (error) {
        console.error(`❌ ${method} ${endpoint}:`, error);
        return { success: false, error: error.message };
    }
}

// Test 1: Create a single notification
async function testCreateNotification() {
    console.log('\n📝 Test 1: Create Single Notification');

    return await apiCall('POST', '/api/notifications', {
        organizationId: CONFIG.organizationId,
        recipientId: CONFIG.recipientId,
        type: 'system',
        title: 'Test Notification',
        message: 'This is a test notification created by the test script.',
        priority: 'medium',
        sendEmail: false, // Set to true to test email
        metadata: {
            testId: 'test-001',
            source: 'test-script'
        }
    });
}

// Test 2: Get notifications (paginated)
async function testGetNotifications() {
    console.log('\n📋 Test 2: Get Notifications');

    return await apiCall('GET', '/api/notifications', null, {
        recipientId: CONFIG.recipientId,
        organizationId: CONFIG.organizationId,
        page: 1,
        limit: 10,
        read: 'false'
    });
}

// Test 3: Get notification statistics
async function testGetStats() {
    console.log('\n📊 Test 3: Get Notification Statistics');

    return await apiCall('GET', '/api/notifications/stats', null, {
        recipientId: CONFIG.recipientId,
        organizationId: CONFIG.organizationId
    });
}

// Test 4: Mark a notification as read
async function testMarkAsRead(notificationId) {
    console.log('\n✔️ Test 4: Mark Notification as Read');

    if (!notificationId) {
        console.log('⚠️ Skipping: No notification ID provided');
        return;
    }

    return await apiCall('PATCH', `/api/notifications/${notificationId}`, {
        organizationId: CONFIG.organizationId,
        recipientId: CONFIG.recipientId
    });
}

// Test 5: Mark all notifications as read
async function testMarkAllAsRead() {
    console.log('\n✔️✔️ Test 5: Mark All Notifications as Read');

    return await apiCall('PATCH', '/api/notifications', {
        recipientId: CONFIG.recipientId,
        organizationId: CONFIG.organizationId
    });
}

// Test 6: Create bulk notifications
async function testCreateBulkNotifications(recipientIds) {
    console.log('\n📝📝 Test 6: Create Bulk Notifications');

    if (!recipientIds || recipientIds.length === 0) {
        console.log('⚠️ Skipping: No recipient IDs provided');
        return;
    }

    return await apiCall('POST', '/api/notifications', {
        organizationId: CONFIG.organizationId,
        recipientIds: recipientIds,
        type: 'announcement',
        title: 'Bulk Test Notification',
        message: 'This is a bulk notification sent to multiple users.',
        priority: 'low',
        sendEmail: false
    });
}

// Test 7: Delete a notification
async function testDeleteNotification(notificationId) {
    console.log('\n🗑️ Test 7: Delete Notification');

    if (!notificationId) {
        console.log('⚠️ Skipping: No notification ID provided');
        return;
    }

    return await apiCall('DELETE', `/api/notifications/${notificationId}`, null, {
        organizationId: CONFIG.organizationId,
        recipientId: CONFIG.recipientId
    });
}

// Test 8: Cleanup old notifications (cron job)
async function testCleanup() {
    console.log('\n🧹 Test 8: Cleanup Old Notifications');

    return await apiCall('POST', '/api/notifications/cleanup', null, {
        cronSecret: CONFIG.cronSecret,
        daysOld: 90
    });
}

// Run all tests in sequence
async function runAllTests() {
    console.log('🚀 Starting Notification System Tests...');
    console.log('Configuration:', CONFIG);

    try {
        // Test 1: Create notification
        const createResult = await testCreateNotification();
        const notificationId = createResult.data?.data?._id;

        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 500));

        // Test 2: Get notifications
        await testGetNotifications();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Test 3: Get stats
        await testGetStats();
        await new Promise(resolve => setTimeout(resolve, 500));

        // Test 4: Mark as read (if we have a notification ID)
        if (notificationId) {
            await testMarkAsRead(notificationId);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Test 5: Mark all as read
        // await testMarkAllAsRead();
        // await new Promise(resolve => setTimeout(resolve, 500));

        // Test 6: Bulk notifications (uncomment and add recipient IDs)
        // await testCreateBulkNotifications(['recipient1', 'recipient2']);
        // await new Promise(resolve => setTimeout(resolve, 500));

        // Test 7: Delete notification (if we have a notification ID)
        // if (notificationId) {
        //   await testDeleteNotification(notificationId);
        //   await new Promise(resolve => setTimeout(resolve, 500));
        // }

        // Test 8: Cleanup (be careful with this in production!)
        // await testCleanup();

        console.log('\n✅ All tests completed!');
    } catch (error) {
        console.error('\n❌ Test suite failed:', error);
    }
}

// Individual test functions for manual testing
const NotificationTests = {
    createNotification: testCreateNotification,
    getNotifications: testGetNotifications,
    getStats: testGetStats,
    markAsRead: testMarkAsRead,
    markAllAsRead: testMarkAllAsRead,
    createBulk: testCreateBulkNotifications,
    deleteNotification: testDeleteNotification,
    cleanup: testCleanup,
    runAll: runAllTests,
};

// Export for use in browser console or test environment
if (typeof window !== 'undefined') {
    window.NotificationTests = NotificationTests;
    console.log('✅ Notification test suite loaded!');
    console.log('Usage: NotificationTests.runAll() or NotificationTests.createNotification()');
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationTests;
}

// Auto-run if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}
