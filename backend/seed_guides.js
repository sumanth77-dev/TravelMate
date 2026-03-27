const bcrypt = require('bcryptjs');
const db = require('./config/db');

const staticGuides = [
  {
    name: "Aarav Sharma",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aarav",
    location: "Jaipur, Rajasthan",
    languages: ["English", "Hindi", "French"],
    rating: 4.9,
    reviewCount: 142,
    pricePerDay: 2500,
    specialties: ["Heritage Walks", "Photography Tours", "Food Tours"]
  },
  {
    name: "Priya Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    location: "Jaipur, Rajasthan",
    languages: ["English", "Hindi", "Spanish"],
    rating: 4.7,
    reviewCount: 98,
    pricePerDay: 2000,
    specialties: ["Cultural Tours", "Art & Crafts", "Temple Visits"]
  },
  {
    name: "Ravi Kumar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ravi",
    location: "Goa",
    languages: ["English", "Hindi", "Portuguese"],
    rating: 4.8,
    reviewCount: 210,
    pricePerDay: 3000,
    specialties: ["Beach Tours", "Nightlife", "Water Sports"]
  },
  {
    name: "Meera Nair",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
    location: "Kerala",
    languages: ["English", "Malayalam", "Hindi"],
    rating: 4.6,
    reviewCount: 75,
    pricePerDay: 1800,
    specialties: ["Backwater Tours", "Ayurveda", "Nature Walks"]
  },
  {
    name: "Arjun Reddy",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
    location: "Hampi, Karnataka",
    languages: ["English", "Kannada", "Hindi"],
    rating: 4.9,
    reviewCount: 165,
    pricePerDay: 2200,
    specialties: ["Archaeology", "Heritage Sites", "Cycling Tours"]
  },
  {
    name: "Sanya Gupta",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sanya",
    location: "Varanasi, UP",
    languages: ["English", "Hindi"],
    rating: 4.5,
    reviewCount: 88,
    pricePerDay: 1500,
    specialties: ["Spiritual Tours", "Boat Rides", "Street Food"]
  },
  {
    name: "Kabir Singh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kabir",
    location: "Manali, HP",
    languages: ["English", "Hindi", "Punjabi"],
    rating: 4.8,
    reviewCount: 130,
    pricePerDay: 2800,
    specialties: ["Trekking", "Adventure Sports", "Camping"]
  },
  {
    name: "Diya Chatterjee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diya",
    location: "Darjeeling, WB",
    languages: ["English", "Bengali", "Hindi", "Nepali"],
    rating: 4.7,
    reviewCount: 92,
    pricePerDay: 1900,
    specialties: ["Tea Garden Tours", "Monastery Visits", "Sunrise Points"]
  },
  {
    name: "Elena Rossi",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
    location: "Rome, Italy",
    languages: ["English", "Italian", "Spanish"],
    rating: 4.9,
    reviewCount: 245,
    pricePerDay: 5000,
    specialties: ["Heritage Walks", "Food Tours", "Art & Crafts"]
  },
  {
    name: "Kenji Tanaka",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kenj",
    location: "Tokyo, Japan",
    languages: ["English", "Japanese"],
    rating: 4.8,
    reviewCount: 180,
    pricePerDay: 4500,
    specialties: ["Nightlife", "Street Food", "Temple Visits"]
  },
  {
    name: "Sophie Laurent",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophie",
    location: "Paris, France",
    languages: ["English", "French"],
    rating: 4.7,
    reviewCount: 310,
    pricePerDay: 4800,
    specialties: ["Photography Tours", "Cultural Tours", "Art & Crafts"]
  }
];

async function seedDatabase() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  console.log('Starting seed...');

  for (const guide of staticGuides) {
    // Generate unique email
    let email = guide.name.toLowerCase().replace(/ /g, '.') + '@example.com';
    let phone = '80' + Math.floor(Math.random() * 89999999 + 10000000);

    // 1. Insert User
    const userQuery = `INSERT INTO users (full_name, email, phone_number, password, role) VALUES (?, ?, ?, ?, 'Guide')`;
    let userId;
    try {
        const [uRes] = await db.query(userQuery, [guide.name, email, phone, hashedPassword]);
        userId = uRes.insertId;
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') {
            const [uRaw] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
            userId = uRaw[0].id;
        } else {
            console.error('Error creating user ' + guide.name, e);
            continue;
        }
    }

    // 2. Insert Guide
    let guideId;
    const guideQuery = `INSERT INTO guides (user_id, city_location, languages_spoken, short_bio, profile_photo, status, is_approved, fixed_rating, fixed_reviews) VALUES (?, ?, ?, ?, ?, 'approved', 1, ?, ?)`;
    const shortBio = 'Passionate local guide eager to show you around.';
    try {
        const [gRes] = await db.query(guideQuery, [userId, guide.location, guide.languages.join(','), shortBio, guide.avatar, guide.rating, guide.reviewCount]);
        guideId = gRes.insertId;
    } catch(e) {
        console.error('Error creating guide ' + guide.name, e);
        continue;
    }

    // 3. Insert Pricing
    await db.query(`INSERT INTO guide_pricing (guide_id, price_per_day, max_group_size) VALUES (?, ?, ?)`, [guideId, guide.pricePerDay, 10]);

    // 4. Insert Expertise
    await db.query(`INSERT INTO guide_expertise (guide_id, special_skills) VALUES (?, ?)`, [guideId, guide.specialties.join(',')]);

    console.log('Seeded: ' + guide.name);
  }
  
  console.log('Seeding finished!');
  process.exit();
}

seedDatabase();
