// Cleanup script to remove old notifications from database
// Run with: node cleanup_notifications.js

const db = require('./config/db');

async function cleanupOldNotifications() {
    try {
        // Delete all notifications (fresh start)
        const [result] = await db.query('DELETE FROM notifications');
        console.log(`✅ Deleted ${result.affectedRows} old notifications`);
        
        // Reset auto increment to 1
        await db.query('ALTER TABLE notifications AUTO_INCREMENT = 1');
        console.log('✅ Reset auto increment counter');
        
        console.log('\n📋 Cleanup complete! All old notifications removed.');
        console.log('💡 Tip: Clear browser localStorage by opening Developer Tools and running:');
        console.log('   localStorage.removeItem("tm_notifications");');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error cleaning up notifications:', error);
        process.exit(1);
    }
}

cleanupOldNotifications();
