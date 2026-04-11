const pool = require('./config/db');

async function removeLastNotification() {
  try {
    console.log('🔄 Fetching the last notification...');
    
    // Get the last notification
    const [notifications] = await pool.query(
      'SELECT id FROM notifications ORDER BY created_at DESC LIMIT 1'
    );
    
    if (!notifications.length) {
      console.log('✅ No notifications to remove');
      process.exit(0);
    }
    
    const notifId = notifications[0].id;
    console.log(`🗑️  Removing notification ID: ${notifId}`);
    
    // Delete the notification
    const [result] = await pool.query(
      'DELETE FROM notifications WHERE id = ?',
      [notifId]
    );
    
    if (result.affectedRows > 0) {
      console.log(`✅ Successfully removed notification #${notifId}`);
    } else {
      console.log('⚠️  No notification was removed');
    }
    
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

removeLastNotification();
