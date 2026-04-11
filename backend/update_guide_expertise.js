const db = require('./config/db');

const guideUpdates = [
  // Goa guides
  { city_location: 'Goa', areas: 'Goa, beaches, water sports, nightlife, Portuguese heritage' },
  // Jaipur guides
  { city_location: 'Jaipur', areas: 'Jaipur, Rajasthan, forts, palaces, desert, pink city' },
  // Manali guides
  { city_location: 'Manali', areas: 'Manali, Himalayas, mountains, trekking, adventure, snow' },
  // Varanasi guides
  { city_location: 'Varanasi', areas: 'Varanasi, spiritual, temples, Ganga, ghats, culture' },
  // Tokyo guides
  { city_location: 'Tokyo', areas: 'Tokyo, Japan, temples, gardens, city, culture, technology' },
  // Paris guides
  { city_location: 'Paris', areas: 'Paris, France, monuments, art, romance, culture, museums' },
  // Kerala guides (for nearby places)
  { city_location: 'Kerala', areas: 'Kerala, backwaters, beaches, ayurveda, culture, nature' },
  // Rome guides
  { city_location: 'Rome', areas: 'Rome, Italy, history, monuments, culture, art, architecture' },
  // Nepal guides (for nearby places)
  { city_location: 'Nepal', areas: 'Nepal, mountains, trekking, adventure, culture, Buddhism' }
];

(async()=>{
  try {
    for (const update of guideUpdates) {
      // Find guides by city location
      const [guides] = await db.query(
        'SELECT g.id FROM guides g WHERE g.city_location LIKE ?',
        [`%${update.city_location}%`]
      );
      
      if (guides.length > 0) {
        for (const guide of guides) {
          // Update or insert expertise
          const [existing] = await db.query(
            'SELECT id FROM guide_expertise WHERE guide_id = ?',
            [guide.id]
          );
          
          if (existing.length > 0) {
            await db.query(
              'UPDATE guide_expertise SET areas_you_guide = ? WHERE guide_id = ?',
              [update.areas, guide.id]
            );
          } else {
            await db.query(
              'INSERT INTO guide_expertise (guide_id, areas_you_guide) VALUES (?, ?)',
              [guide.id, update.areas]
            );
          }
          console.log(`✅ Updated guide ID ${guide.id} for ${update.city_location}: "${update.areas}"`);
        }
      } else {
        console.log(`⚠️  No guides found for ${update.city_location}`);
      }
    }
    
    // Now add fake guides for places without any
    const placesNeedingGuides = [
      { name: 'Bali', place: 'bali', count: 2 },
      { name: 'Swiss', place: 'swiss', count: 2 },
      { name: 'Maldives', place: 'maldives', count: 2 },
      { name: 'Queenstown', place: 'queenstown', count: 2 }
    ];

    for (const place of placesNeedingGuides) {
      const [existing] = await db.query(
        'SELECT COUNT(*) as cnt FROM guides g WHERE g.city_location LIKE ?',
        [`%${place.name}%`]
      );
      
      if (existing[0].cnt === 0 && place.count > 0) {
        console.log(`\n📍 Adding ${place.count} guides for ${place.name}...`);
        // Add new guides for this place
        // Note: This requires creating users first, which is complex
        // For now, we'll just log that they're needed
        console.log(`ℹ️  To add guides for ${place.name}, create new users first, then register them as guides`);
      }
    }
    
    console.log('\n✨ Guide expertise update complete!');
    
  } catch(e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
})();
