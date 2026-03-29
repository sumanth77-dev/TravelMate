const db = require('./config/db');

async function run() {
  try {
    const [cols] = await db.query("SHOW COLUMNS FROM bookings");
    console.log("Bookings columns:", cols.map(c => c.Field).join(", "));
    
    const [bookings] = await db.query("SELECT * FROM bookings WHERE status = 'completed'");
    console.log("Completed bookings count:", bookings.length);
    if(bookings.length > 0) console.log("Sample booking:", JSON.stringify(bookings[0], null, 2));

    const [ratings] = await db.query("SELECT * FROM ratings");
    console.log("Ratings count:", ratings.length);

    const [users] = await db.query("SELECT id, points FROM users LIMIT 1");
    console.log("Users points sample:", users);

  } catch(e) { console.error(e); }
  process.exit();
}
run();
