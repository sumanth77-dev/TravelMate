const db = require('./config/db');
const bcrypt = require('bcryptjs');

const newGuides = [
  // Kyoto, Japan
  {
    full_name: 'Yuki Tanaka',
    email: 'yuki.tanaka@travelmate.com',
    password: 'Guide123',
    phone_number: '+81-75-222-3344',
    city_location: 'Kyoto, Japan',
    languages_spoken: 'Japanese, English',
    years_of_experience: 8,
    guide_type: 'Cultural Guide',
    short_bio: 'Expert in traditional Kyoto temples, gardens, and cultural experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'Kyoto, temples, gardens, culture, geisha, traditional arts, tea ceremony'
  },
  {
    full_name: 'Hana Suzuki',
    email: 'hana.suzuki@travelmate.com',
    password: 'Guide123',
    phone_number: '+81-75-222-3345',
    city_location: 'Kyoto, Japan',
    languages_spoken: 'Japanese, English, French',
    years_of_experience: 6,
    guide_type: 'Tour Guide',
    short_bio: 'Specialized in Kyoto seasonal experiences and hidden local spots',
    status: 'approved',
    is_approved: 1,
    areas: 'Kyoto, scenic tours, seasonal, local experiences, hiking, bamboo forests'
  },
  // Additional Tokyo guides
  {
    full_name: 'Takeshi Yamamoto',
    email: 'takeshi.yamamoto@travelmate.com',
    password: 'Guide123',
    phone_number: '+81-3-222-3346',
    city_location: 'Tokyo, Japan',
    languages_spoken: 'Japanese, English, Mandarin',
    years_of_experience: 10,
    guide_type: 'City Guide',
    short_bio: 'Professional Tokyo guide specializing in modern culture, tech, and nightlife',
    status: 'approved',
    is_approved: 1,
    areas: 'Tokyo, modern culture, technology, nightlife, shopping, urban exploration'
  },
  // Additional Bali guides
  {
    full_name: 'Wayan Sudirta',
    email: 'wayan.sudirta@travelmate.com',
    password: 'Guide123',
    phone_number: '+62-811-222-3346',
    city_location: 'Bali, Indonesia',
    languages_spoken: 'Indonesian, English, Spanish',
    years_of_experience: 9,
    guide_type: 'Adventure Guide',
    short_bio: 'Expert in Bali adventure activities including volcano hikes and water sports',
    status: 'approved',
    is_approved: 1,
    areas: 'Bali, volcanoes, hiking, adventure, water sports, nature, eco-tourism'
  },
  // Additional Paris guides
  {
    full_name: 'Pierre Dubois',
    email: 'pierre.dubois@travelmate.com',
    password: 'Guide123',
    phone_number: '+33-1-222-3346',
    city_location: 'Paris, France',
    languages_spoken: 'French, English, German',
    years_of_experience: 12,
    guide_type: 'Historical Guide',
    short_bio: 'Expert in Parisian history, literature, and hidden historical landmarks',
    status: 'approved',
    is_approved: 1,
    areas: 'Paris, history, literature, museums, monuments, historical tours, art galleries'
  },
  // Additional Maldives guides
  {
    full_name: 'Rasheed Ibrahim',
    email: 'rasheed.ibrahim@travelmate.com',
    password: 'Guide123',
    phone_number: '+960-770-022-335',
    city_location: 'Maldives',
    languages_spoken: 'English, Dhivehi',
    years_of_experience: 7,
    guide_type: 'Marine Guide',
    short_bio: 'Specialized in Maldives marine life, diving certification, and underwater photography',
    status: 'approved',
    is_approved: 1,
    areas: 'Maldives, diving, marine life, underwater photography, snorkeling, eco-tourism'
  },
  // Additional Goa guides
  {
    full_name: 'Arun Prabhu',
    email: 'arun.prabhu@travelmate.com',
    password: 'Guide123',
    phone_number: '+91-832-222-3346',
    city_location: 'Goa, India',
    languages_spoken: 'Konkani, English, Hindi',
    years_of_experience: 7,
    guide_type: 'Beach Guide',
    short_bio: 'Expert in Goa beaches, water sports, and beach party experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'Goa, beaches, water sports, nightlife, beach shacks, water sports'
  },
  {
    full_name: 'Priya Nair',
    email: 'priya.nair@travelmate.com',
    password: 'Guide123',
    phone_number: '+91-832-222-3347',
    city_location: 'Goa, India',
    languages_spoken: 'English, Hindi, Portuguese',
    years_of_experience: 6,
    guide_type: 'Cultural Guide',
    short_bio: 'Specialized in Goa Portuguese heritage, forts, and cultural exploration',
    status: 'approved',
    is_approved: 1,
    areas: 'Goa, heritage, forts, Portuguese culture, churches, history'
  },
  // Additional Manali guides
  {
    full_name: 'Vikram Singh',
    email: 'vikram.singh@travelmate.com',
    password: 'Guide123',
    phone_number: '+91-1902-222-3346',
    city_location: 'Manali, India',
    languages_spoken: 'Hindi, English, Punjabi',
    years_of_experience: 8,
    guide_type: 'Trek Guide',
    short_bio: 'Professional Trek guide in Himalayas with expertise in adventure activities',
    status: 'approved',
    is_approved: 1,
    areas: 'Manali, trekking, adventure, mountains, paragliding, skiing, nature'
  },
  {
    full_name: 'Deepika Sharma',
    email: 'deepika.sharma@travelmate.com',
    password: 'Guide123',
    phone_number: '+91-1902-222-3347',
    city_location: 'Manali, India',
    languages_spoken: 'English, Hindi, Tibetan',
    years_of_experience: 7,
    guide_type: 'Mountain Guide',
    short_bio: 'Expert in Manali scenic tours and eco-tourism experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'Manali, scenic tours, river activities, camping, nature exploration'
  },
  // Additional Varanasi guides
  {
    full_name: 'Rajesh Kumar',
    email: 'rajesh.kumar@travelmate.com',
    password: 'Guide123',
    phone_number: '+91-542-222-3346',
    city_location: 'Varanasi, India',
    languages_spoken: 'Hindi, English, Sanskrit',
    years_of_experience: 10,
    guide_type: 'Spiritual Guide',
    short_bio: 'Expert in Varanasi spiritual tourism, Ganga rituals, and Hindu philosophy',
    status: 'approved',
    is_approved: 1,
    areas: 'Varanasi, spirituality, temples, Ganga rituals, religion, philosophy'
  },
  {
    full_name: 'Anjali Verma',
    email: 'anjali.verma@travelmate.com',
    password: 'Guide123',
    phone_number: '+91-542-222-3347',
    city_location: 'Varanasi, India',
    languages_spoken: 'English, Hindi, Marathi',
    years_of_experience: 6,
    guide_type: 'Cultural Guide',
    short_bio: 'Specialized in Varanasi history, art forms, and authentic cultural experiences',
    status: 'approved',
    is_approved: 1,
    areas: 'Varanasi, culture, history, traditional arts, local crafts, heritage'
  },
  // Additional Swiss Alps guides
  {
    full_name: 'Anna Friedrich',
    email: 'anna.friedrich@travelmate.com',
    password: 'Guide123',
    phone_number: '+41-31-222-3346',
    city_location: 'Swiss Alps, Switzerland',
    languages_spoken: 'German, French, English, Italian',
    years_of_experience: 11,
    guide_type: 'Alpine Guide',
    short_bio: 'Certified alpine guide with extensive experience in mountain climbing',
    status: 'approved',
    is_approved: 1,
    areas: 'swiss, mountains, climbing, alpine routes, mountaineering, advanced trekking'
  },
  // Additional Queenstown guides
  {
    full_name: 'Mike Thompson',
    email: 'mike.thompson@travelmate.com',
    password: 'Guide123',
    phone_number: '+64-3-442-2235',
    city_location: 'Queenstown, New Zealand',
    languages_spoken: 'English',
    years_of_experience: 9,
    guide_type: 'Adventure Tour Operator',
    short_bio: 'Experienced in all extreme sports and adventure activities in Queenstown',
    status: 'approved',
    is_approved: 1,
    areas: 'queenstown, extreme sports, jet boating, paragliding, climbing, adventure'
  }
];

// Also update existing guides' expertise if needed
const updateExpertises = [
  { email: 'kenji.tanaka@travelmate.com', areas: 'Tokyo, Japan, temples, gardens, city, culture, technology, modern culture' },
  { email: 'sophie.laurent@travelmate.com', areas: 'Paris, France, monuments, art, romance, culture, museums, history, literature' }
];

(async()=>{
  try {
    let addedCount = 0;
    
    console.log('🚀 Adding new guides...\n');
    
    for (const guide of newGuides) {
      try {
        // Check if user already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [guide.email]);
        if (existing.length > 0) {
          console.log(`⏭️  ${guide.full_name} already exists, skipping...`);
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
          'INSERT INTO guide_expertise (guide_id, areas_you_guide, special_skills) VALUES (?, ?, ?)',
          [guideId, guide.areas, guide.guide_type]
        );

        // Create default pricing
        await db.query(
          'INSERT INTO guide_pricing (guide_id, price_per_day, max_group_size) VALUES (?, ?, ?)',
          [guideId, 85, 8]
        );

        console.log(`✅ Added: ${guide.full_name}`);
        console.log(`   📍 Location: ${guide.city_location}`);
        console.log(`   🗣️  Languages: ${guide.languages_spoken}\n`);
        addedCount++;
      } catch (e) {
        console.error(`❌ Error adding ${guide.full_name}:`, e.message);
      }
    }

    console.log('\n📝 Updating existing guides...\n');
    
    for (const update of updateExpertises) {
      try {
        const [users] = await db.query('SELECT id FROM users WHERE email = ?', [update.email]);
        if (users.length > 0) {
          const userId = users[0].id;
          const [guides] = await db.query('SELECT id FROM guides WHERE user_id = ?', [userId]);
          
          if (guides.length > 0) {
            const guideId = guides[0].id;
            const [existing] = await db.query('SELECT id FROM guide_expertise WHERE guide_id = ?', [guideId]);
            
            if (existing.length > 0) {
              await db.query(
                'UPDATE guide_expertise SET areas_you_guide = ? WHERE guide_id = ?',
                [update.areas, guideId]
              );
              console.log(`✅ Updated expertise for: ${update.email}`);
            }
          }
        }
      } catch (e) {
        console.error(`❌ Error updating ${update.email}:`, e.message);
      }
    }

    console.log(`\n✨ Successfully added ${addedCount} new guides!\n`);
    console.log('📊 Summary:');
    console.log('   • Kyoto: 2 guides');
    console.log('   • Tokyo: +1 guide (total 3)');
    console.log('   • Bali: +1 guide (total 3)');
    console.log('   • Paris: +1 guide (total 3)');
    console.log('   • Maldives: +1 guide (total 3)');
    console.log('   • Goa: +2 guides (total 4)');
    console.log('   • Manali: +2 guides (total 4)');
    console.log('   • Varanasi: +2 guides (total 4)');
    console.log('   • Swiss Alps: +1 guide (total 3)');
    console.log('   • Queenstown: +1 guide (total 3)');
    console.log('\n🎉 All guides are now available in the backend!\n');
    
  } catch(e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
})();
