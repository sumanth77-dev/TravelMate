const db = require('./config/db');
async function run() {
  try {
    const [bookings] = await db.query("SELECT id, guide_id FROM bookings WHERE status = 'completed' LIMIT 5");
    console.log("Bookings sample:", bookings);
    
    // Check if these guide_ids exist in guides.id
    for (let b of bookings) {
      const [g1] = await db.query("SELECT * FROM guides WHERE id = ?", [b.guide_id]);
      const [g2] = await db.query("SELECT * FROM guides WHERE user_id = ?", [b.guide_id]);
      
      console.log(`Booking ID ${b.id} has guide_id=${b.guide_id}.`);
      console.log(` -> Found in guides.id? ${g1.length > 0}`);
      console.log(` -> Found in guides.user_id? ${g2.length > 0}`);
    }
  } catch(e) { console.error(e); }
  process.exit();
}
run();
