const db = require('./config/db');

(async()=>{
  const [guides] = await db.query(`
    SELECT g.id, u.full_name, g.city_location, ge.areas_you_guide 
    FROM guides g 
    JOIN guide_expertise ge ON g.id = ge.guide_id 
    JOIN users u ON g.user_id = u.id 
    WHERE g.city_location LIKE '%Bali%' OR ge.areas_you_guide LIKE '%Bali%'
  `);
  console.log('Bali Guides in DB:', guides.length);
  guides.forEach(g => console.log('- ' + g.full_name + ' => ' + (g.areas_you_guide || '').substring(0, 50)));
  process.exit(0);
})();
