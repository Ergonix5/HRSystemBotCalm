// Script to delete all test notifications
// Run with: node delete-test-notifications.js

async function deleteTestNotifications() {
    const baseUrl = 'http://localhost:3000';
    const recipientId = '69443243509c41357854aadf';
    const organizationId = '69426e67f7ac33645aad354c';

    try {
        console.log('Fetching notifications...\n');

        const response = await fetch(
            `${baseUrl}/api/notifications?recipientId=${recipientId}&organizationId=${organizationId}&page=1&limit=100`
        );

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            console.log('No notifications to delete.');
            return;
        }

        console.log(`Found ${data.data.length} notifications. Deleting...\n`);

        for (const notification of data.data) {
            try {
                const deleteResponse = await fetch(
                    `${baseUrl}/api/notifications/${notification._id}?recipientId=${recipientId}&organizationId=${organizationId}`,
                    { method: 'DELETE' }
                );

                if (deleteResponse.ok) {
                    console.log(`✅ Deleted: ${notification.title}`);
                } else {
                    console.log(`❌ Failed to delete: ${notification.title}`);
                }
            } catch (error) {
                console.log(`❌ Error deleting ${notification.title}:`, error.message);
            }

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n✨ Done!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

deleteTestNotifications();
