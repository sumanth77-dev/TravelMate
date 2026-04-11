const db = require('./config/db');
const bcrypt = require('bcryptjs');

const newGuides = [
  // Bali guides
  {
    full_name: 'Made Wijaya',
    email: 'made.wijaya@travelmate.com',
    password: 'Guide123',
    phone_number: '+62-811-222-3344',
    user_type: 'guide',
    city_location: 'Bali, Indonesia',
    languages_spoken: 'Indonesian, English',
    years_of_experience: 6,
    guide_type: 'Tour Guide',
    short_bio: 'Experienced local guide specializing in Bali temples, beaches and cultural experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'Bali, temples, beaches, water sports, culture, rice terraces'
  },
  {
    full_name: 'Ketut Buana',
    email: 'ketut.buana@travelmate.com',
    password: 'Guide123',
    phone_number: '+62-811-222-3345',
    user_type: 'guide',
    city_location: 'Bali, Indonesia',
    languages_spoken: 'Indonesian, English, Mandarin',
    years_of_experience: 8,
    guide_type: 'Tour Guide',
    short_bio: 'Expert in Bali adventure tours - hiking, diving, and cultural experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'Bali, adventure, diving, trekking, culture'
  },
  // Maldives guides
  {
    full_name: 'Ahmed Hassan',
    email: 'ahmed.hassan@travelmate.com',
    password: 'Guide123',
    phone_number: '+960-770-022-333',
    user_type: 'guide',
    city_location: 'Maldives',
    languages_spoken: 'English, Arabic, Dhivehi',
    years_of_experience: 7,
    guide_type: 'Resort Guide',
    short_bio: 'Professional Maldives guide specializing in resort experiences and water activities',
    status: 'approved',
    is_approved: 1,
    areas: 'Maldives, beaches, diving, snorkeling, resorts, luxury'
  },
  {
    full_name: 'Fathimath Ali',
    email: 'fathimath.ali@travelmate.com',
    password: 'Guide123',
    phone_number: '+960-770-022-334',
    user_type: 'guide',
    city_location: 'Maldives',
    languages_spoken: 'English, Italian, Dhivehi',
    years_of_experience: 5,
    guide_type: 'Tour Guide',
    short_bio: 'Local expert in Maldives islands, snorkeling and island hopping tours',
    status: 'approved',
    is_approved: 1,
    areas: 'Maldives, islands, snorkeling, eco-tourism, water sports'
  },
  // Swiss guides
  {
    full_name: 'Hans Mueller',
    email: 'hans.mueller@travelmate.com',
    password: 'Guide123',
    phone_number: '+41-31-222-3344',
    user_type: 'guide',
    city_location: 'Swiss Alps, Switzerland',
    languages_spoken: 'German, English, French',
    years_of_experience: 12,
    guide_type: 'Mountain Guide',
    short_bio: 'Certified mountain guide with expertise in Swiss Alps trekking and skiing',
    status: 'approved',
    is_approved: 1,
    areas: 'swiss, mountains, trekking, skiing, hiking, alps, nature'
  },
  {
    full_name: 'Maria Schmidt',
    email: 'maria.schmidt@travelmate.com',
    password: 'Guide123',
    phone_number: '+41-31-222-3345',
    user_type: 'guide',
    city_location: 'Swiss Alps, Switzerland',
    languages_spoken: 'German, French, English, Italian',
    years_of_experience: 9,
    guide_type: 'Tour Guide',
    short_bio: 'Specialized in Swiss mountain tours and Alpine village experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'swiss, mountains, villages, lakes, scenic tours, photography'
  },
  // Queenstown guides
  {
    full_name: 'Jack Holden',
    email: 'jack.holden@travelmate.com',
    password: 'Guide123',
    phone_number: '+64-3-442-2233',
    user_type: 'guide',
    city_location: 'Queenstown, New Zealand',
    languages_spoken: 'English',
    years_of_experience: 10,
    guide_type: 'Adventure Guide',
    short_bio: 'Professional adventure guide specializing in bungee jumping and extreme sports',
    status: 'approved',
    is_approved: 1,
    areas: 'queenstown, adventure, bungee, skiing, lakes, mountains'
  },
  {
    full_name: 'Sarah Wilson',
    email: 'sarah.wilson@travelmate.com',
    password: 'Guide123',
    phone_number: '+64-3-442-2234',
    user_type: 'guide',
    city_location: 'Queenstown, New Zealand',
    languages_spoken: 'English, Maori',
    years_of_experience: 8,
    guide_type: 'Tour Guide',
    short_bio: 'Local expert in Queenstown adventure tours and scenic experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'queenstown, lakes, hiking, adventure, scenic, nature'
  }
];

(async()=>{
  try {
    let addedCount = 0;
    
    for (const guide of newGuides) {
      try {
        // Check if user already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [guide.email]);
        if (existing.length > 0) {
          console.log(`⚠️  User ${guide.full_name} already exists, skipping...`);
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(guide.password, 10);

        // Create user
        const [userResult] = await db.query(
          'INSERT INTO users (full_name, email, password, phone_number, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
          [guide.full_name, guide.email, hashedPassword, guide.phone_number, 'Guide']
        );

        const userId = userResult.insertId;

        // Create guide
        const [guideResult] = await db.query(
          'INSERT INTO guides (user_id, city_location, languages_spoken, years_of_experience, guide_type, short_bio, status, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [userId, guide.city_location, guide.languages_spoken, guide.years_of_experience, guide.guide_type, guide.short_bio, guide.status, guide.is_approved]
        );

        const guideId = guideResult.insertId;

        // Create guide expertise
        await db.query(
          'INSERT INTO guide_expertise (guide_id, areas_you_guide) VALUES (?, ?)',
          [guideId, guide.areas]
        );

        // Create default pricing
        await db.query(
          'INSERT INTO guide_pricing (guide_id, price_per_day, max_group_size) VALUES (?, ?, ?)',
          [guideId, 80, 8]
        );

        console.log(`✅ Added guide: ${guide.full_name} (${guide.city_location})`);
        addedCount++;
      } catch (e) {
        console.error(`❌ Error adding ${guide.full_name}:`, e.message);
      }
    }

    console.log(`\n✨ Successfully added ${addedCount} new guides!`);
    
  } catch(e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
})();
