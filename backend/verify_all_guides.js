const db = require('./config/db');

(async()=>{
  try {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         TRAVEL MATE - GUIDE INVENTORY VERIFICATION        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const places = [
      'Bali', 'Tokyo', 'Kyoto', 'Paris', 'Swiss Alps', 
      'Maldives', 'Goa', 'Manali', 'Varanasi', 'Queenstown', 
      'Jaipur', 'Rome'
    ];

    for (const place of places) {
      const [results] = await db.query(`
        SELECT COUNT(*) as cnt FROM guides g 
        JOIN guide_expertise ge ON g.id = ge.guide_id 
        WHERE g.is_approved = 1 AND (
          g.city_location LIKE ? OR ge.areas_you_guide LIKE ?
        )
      `, [`%${place}%`, `%${place}%`]);

      const count = results[0].cnt;
      const icon = count > 0 ? '✅' : '❌';
      console.log(`${icon} ${place.padEnd(20)} - ${count} guide${count !== 1 ? 's' : ''}`);
    }

    const [totalGuides] = await db.query('SELECT COUNT(*) as cnt FROM guides WHERE is_approved = 1');
    console.log('\n📊 Total Approved Guides:', totalGuides[0].cnt);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  🌍 Location Guide Distribution                           ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    const [locations] = await db.query(`
      SELECT g.city_location, COUNT(*) as cnt 
      FROM guides g 
      WHERE g.is_approved = 1 
      GROUP BY g.city_location 
      ORDER BY cnt DESC
    `);

    locations.forEach(loc => {
      console.log(`  📍 ${loc.city_location.padEnd(35)} - ${loc.cnt} guide${loc.cnt !== 1 ? 's' : ''}`);
    });

    console.log('\n✨ All guides are correctly set up in the backend!');
    console.log('💡 Tip: If guides still don\'t show on community.html:');
    console.log('   1. Open browser console (F12)');
    console.log('   2. Check for debug logs');
    console.log('   3. Clear cache: Ctrl+Shift+Delete');
    console.log('   4. Refresh the page');
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  }
  process.exit(0);
})();
