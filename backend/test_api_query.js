const db = require('./config/db');

(async()=>{
  try {
    console.log('📊 Checking Bali guides with full details:\n');
    
    const [results] = await db.query(`
      SELECT 
        g.id, g.user_id, g.is_approved,
        u.full_name, g.city_location, g.languages_spoken, g.years_of_experience, g.guide_type,
        ge.id as expertise_id, ge.areas_you_guide
      FROM guides g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN guide_expertise ge ON g.id = ge.guide_id
      WHERE g.city_location LIKE '%Bali%'
      ORDER BY g.id
    `);
    
    results.forEach(r => {
      console.log(`Guide: ${r.full_name}`);
      console.log(`  - ID: ${r.id}, Approved: ${r.is_approved}`);
      console.log(`  - Location: ${r.city_location}`);
      console.log(`  - Languages: ${r.languages_spoken}`);
      console.log(`  - Experience: ${r.years_of_experience} years`);
      console.log(`  - Expertise ID: ${r.expertise_id}`);
      console.log(`  - Areas: ${r.areas_you_guide || 'NULL'}`);
      console.log('');
    });
    
    // Also test what the API query would return
    console.log('📡 Testing API query result:\n');
    const [apiResults] = await db.query(`
      SELECT g.id, g.user_id, g.city_location, g.languages_spoken, g.years_of_experience,
             g.guide_type, g.short_bio, g.profile_photo,
             u.full_name, u.email, u.phone_number,
             gp.price_per_day, gp.max_group_size,
             ge.areas_you_guide, ge.special_skills,
             COALESCE(g.fixed_rating, r.avg_rating, 0) AS average_rating,
             COALESCE(g.fixed_reviews, r.review_count, 0) AS review_count
      FROM guides g
      JOIN users u ON g.user_id = u.id
      LEFT JOIN guide_pricing gp ON g.id = gp.guide_id
      LEFT JOIN guide_expertise ge ON g.id = ge.guide_id
      LEFT JOIN (
        SELECT guide_id, AVG(rating) as avg_rating, COUNT(id) as review_count 
        FROM reviews 
        GROUP BY guide_id
      ) r ON g.id = r.guide_id
      WHERE g.is_approved = TRUE AND (g.city_location LIKE '%Bali%' OR ge.areas_you_guide LIKE '%Bali%')
      ORDER BY g.id
    `);
    
    console.log(`API returned ${apiResults.length} guides for Bali:\n`);
    apiResults.forEach(g => {
      console.log(`✅ ${g.full_name}`);
      console.log(`   Areas: ${g.areas_you_guide}`);
      console.log('');
    });
    
  } catch(e) {
    console.error('❌ Error:', e.message);
  }
  process.exit(0);
})();
