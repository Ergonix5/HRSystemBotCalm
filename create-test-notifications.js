// Script to create test notifications
// Run with: node create-test-notifications.js

const testData = require('./test-notifications.json');

async function createTestNotifications() {
    const baseUrl = 'http://localhost:3000';

    console.log('Creating test notifications...\n');

    for (let i = 0; i < testData.notifications.length; i++) {
        const notification = testData.notifications[i];

        try {
            const response = await fetch(`${baseUrl}/api/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizationId: testData.organizationId,
                    recipientId: testData.recipientId,
                    ...notification
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log(`✅ Created: ${notification.title}`);
            } else {
                console.log(`❌ Failed: ${notification.title} - ${result.message}`);
            }
        } catch (error) {
            console.log(`❌ Error: ${notification.title} - ${error.message}`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n✨ Done! Check your notification dropdown.');
}

createTestNotifications();
