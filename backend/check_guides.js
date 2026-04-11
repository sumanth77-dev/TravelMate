const db = require('./config/db');

(async()=>{
  try {
    const [guides] = await db.query(`
      SELECT g.id, u.full_name, g.city_location, ge.areas_you_guide 
      FROM guides g 
      JOIN guide_expertise ge ON g.id = ge.guide_id 
      JOIN users u ON g.user_id = u.id 
      ORDER BY g.id
    `);
    console.log('📍 Existing Guides:');
    console.log('=====================================');
    guides.forEach((g, i) => {
      const areas = (g.areas_you_guide || 'N/A').substring(0, 60);
      console.log(`${i+1}. ${g.full_name} (${g.city_location})\n   Areas: ${areas}`);
    });
    console.log('\n📊 Total Guides: ' + guides.length);
  } catch(e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
})();
