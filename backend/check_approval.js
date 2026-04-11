const db = require('./config/db');

(async()=>{
  try {
    const [result] = await db.query('SELECT COUNT(*) as cnt FROM guides WHERE is_approved = 1');
    console.log('✅ Approved guides:', result[0].cnt);
    
    const [result2] = await db.query('SELECT COUNT(*) as cnt FROM guides WHERE is_approved = 0');
    console.log('⏳ Pending guides:', result2[0].cnt);
    
    // Check specifically for our new guides
    const [newGuides] = await db.query(`
      SELECT u.full_name, g.is_approved, g.city_location 
      FROM guides g 
      JOIN users u ON g.user_id = u.id 
      WHERE u.email LIKE '%.tanaka@%' OR u.email LIKE '%.suzuki@%' OR u.email LIKE '%.wijaya@%'
    `);
    
    console.log('\n📍 New Guides Status:');
    newGuides.forEach(g => {
      console.log(`- ${g.full_name} (${g.city_location}): ${g.is_approved ? '✅ Approved' : '❌ Pending'}`);
    });
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
})();
