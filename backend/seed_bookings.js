const db = require('./config/db');

async function seedBookings() {
  console.log('Seeding bookings...');
  
  // Get a user and a guide
  const [users] = await db.query('SELECT id, full_name, email FROM users WHERE role = "User" LIMIT 1');
  if (!users.length) {
     console.log('No user found to create booking, creating one...');
     const [uRes] = await db.query(`INSERT INTO users (full_name, email, phone_number, password, role) VALUES ('Demo Traveler', 'traveler@demo.com', '1234567890', 'hash', 'User')`);
     users.push({ id: uRes.insertId });
  }
  const travelerId = users[0].id;

  const [guides] = await db.query('SELECT id FROM guides LIMIT 1');
  if(!guides.length) {
     console.log('No guide found to create booking, please run seed_guides.js first.');
     process.exit();
  }
  const guideId = guides[0].id;

  // Insert completed bookings for earnings (last 3 months)
  const queries = [
    `INSERT INTO bookings (user_id, guide_id, booking_date, group_size, duration, message, total_price, status) VALUES (?, ?, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 2, 8, 'Heritage tour', 4000, 'completed')`,
    `INSERT INTO bookings (user_id, guide_id, booking_date, group_size, duration, message, total_price, status) VALUES (?, ?, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 4, 16, 'Weekend package', 6400, 'completed')`,
    `INSERT INTO bookings (user_id, guide_id, booking_date, group_size, duration, message, total_price, status) VALUES (?, ?, CURDATE(), 2, 8, 'City highlights', 4000, 'completed')`,
    `INSERT INTO bookings (user_id, guide_id, booking_date, group_size, duration, message, total_price, status) VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 3, 4, 'Upcoming trip', 3000, 'approved')`,
    `INSERT INTO bookings (user_id, guide_id, booking_date, group_size, duration, message, total_price, status) VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 1, 8, 'Solo traveler trip', 2000, 'pending')`,
  ];

  for (let q of queries) {
      try {
          await db.query(q, [travelerId, guideId]);
      } catch (e) {
          console.error(e);
      }
  }

  console.log('Bookings seeded successfully!');
  process.exit();
}

seedBookings();
