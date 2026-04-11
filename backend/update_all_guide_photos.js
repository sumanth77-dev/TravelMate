/**
 * Update guide profile photos with AI-generated avatars  
 * Uses the existing server pool connection
 */

const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

// Photo URLs mapped to guide IDs
const photoUrls = {
  3: 'https://api.dicebear.com/7.x/bottts/svg?seed=3&scale=90&backgroundColor=random',
  5: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=5&scale=90&backgroundColor=random',
  9: 'https://api.dicebear.com/7.x/lorelei/svg?seed=9&scale=90&backgroundColor=random',
  10: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=10&scale=90&backgroundColor=random',
  11: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11&scale=90&backgroundColor=random',
  12: 'https://api.dicebear.com/7.x/personas/svg?seed=12&scale=90&backgroundColor=random',
  13: 'https://api.dicebear.com/7.x/bottts/svg?seed=13&scale=90&backgroundColor=random',
  14: 'https://api.dicebear.com/7.x/lorelei/svg?seed=14&scale=90&backgroundColor=random',
  15: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=15&scale=90&backgroundColor=random',
  16: 'https://api.dicebear.com/7.x/avataaars/svg?seed=16&scale=90&backgroundColor=random',
  17: 'https://api.dicebear.com/7.x/personas/svg?seed=17&scale=90&backgroundColor=random',
  18: 'https://api.dicebear.com/7.x/bottts/svg?seed=18&scale=90&backgroundColor=random',
  19: 'https://api.dicebear.com/7.x/lorelei/svg?seed=19&scale=90&backgroundColor=random',
  20: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=20&scale=90&backgroundColor=random',
  21: 'https://api.dicebear.com/7.x/avataaars/svg?seed=21&scale=90&backgroundColor=random',
  22: 'https://api.dicebear.com/7.x/personas/svg?seed=22&scale=90&backgroundColor=random',
  23: 'https://api.dicebear.com/7.x/bottts/svg?seed=23&scale=90&backgroundColor=random',
  24: 'https://api.dicebear.com/7.x/lorelei/svg?seed=24&scale=90&backgroundColor=random',
  25: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=25&scale=90&backgroundColor=random',
  26: 'https://api.dicebear.com/7.x/avataaars/svg?seed=26&scale=90&backgroundColor=random',
  27: 'https://api.dicebear.com/7.x/personas/svg?seed=27&scale=90&backgroundColor=random',
  28: 'https://api.dicebear.com/7.x/bottts/svg?seed=28&scale=90&backgroundColor=random',
  29: 'https://api.dicebear.com/7.x/lorelei/svg?seed=29&scale=90&backgroundColor=random',
  30: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=30&scale=90&backgroundColor=random',
  31: 'https://api.dicebear.com/7.x/avataaars/svg?seed=31&scale=90&backgroundColor=random',
  32: 'https://api.dicebear.com/7.x/personas/svg?seed=32&scale=90&backgroundColor=random',
  33: 'https://api.dicebear.com/7.x/bottts/svg?seed=33&scale=90&backgroundColor=random',
  34: 'https://api.dicebear.com/7.x/lorelei/svg?seed=34&scale=90&backgroundColor=random',
  35: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=35&scale=90&backgroundColor=random',
  36: 'https://api.dicebear.com/7.x/avataaars/svg?seed=36&scale=90&backgroundColor=random',
  37: 'https://api.dicebear.com/7.x/personas/svg?seed=37&scale=90&backgroundColor=random',
  38: 'https://api.dicebear.com/7.x/bottts/svg?seed=38&scale=90&backgroundColor=random',
  39: 'https://api.dicebear.com/7.x/lorelei/svg?seed=39&scale=90&backgroundColor=random',
  40: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=40&scale=90&backgroundColor=random',
  41: 'https://api.dicebear.com/7.x/avataaars/svg?seed=41&scale=90&backgroundColor=random',
  42: 'https://api.dicebear.com/7.x/personas/svg?seed=42&scale=90&backgroundColor=random',
  43: 'https://api.dicebear.com/7.x/bottts/svg?seed=43&scale=90&backgroundColor=random',
  44: 'https://api.dicebear.com/7.x/lorelei/svg?seed=44&scale=90&backgroundColor=random',
  45: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=45&scale=90&backgroundColor=random',
  46: 'https://api.dicebear.com/7.x/avataaars/svg?seed=46&scale=90&backgroundColor=random',
  47: 'https://api.dicebear.com/7.x/personas/svg?seed=47&scale=90&backgroundColor=random',
  48: 'https://api.dicebear.com/7.x/bottts/svg?seed=48&scale=90&backgroundColor=random',
  49: 'https://api.dicebear.com/7.x/lorelei/svg?seed=49&scale=90&backgroundColor=random',
  50: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=50&scale=90&backgroundColor=random',
  51: 'https://api.dicebear.com/7.x/avataaars/svg?seed=51&scale=90&backgroundColor=random',
  52: 'https://api.dicebear.com/7.x/personas/svg?seed=52&scale=90&backgroundColor=random',
  53: 'https://api.dicebear.com/7.x/bottts/svg?seed=53&scale=90&backgroundColor=random',
  54: 'https://api.dicebear.com/7.x/lorelei/svg?seed=54&scale=90&backgroundColor=random',
  55: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=55&scale=90&backgroundColor=random'
};

async function updateGuidePhotos() {
  console.log('📸 Updating guide profile photos...\n');
  
  const guideIds = Object.keys(photoUrls);
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < guideIds.length; i++) {
    const guideId = parseInt(guideIds[i]);
    const photoUrl = photoUrls[guideId];
    
    try {
      process.stdout.write(`[${i + 1}/${guideIds.length}] Guide #${guideId}...`);
      
      const result = await pool.query(
        'UPDATE guides SET profile_photo = ? WHERE id = ?',
        [photoUrl, guideId]
      );
      
      if (result[0].affectedRows > 0) {
        console.log(' ✅');
        success++;
      } else {
        console.log(' ⚠️  (no rows updated)');
        failed++;
      }
    } catch (err) {
      console.log(` ❌ (${err.message})`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Updated: ${success} guides`);
  console.log(`❌ Failed: ${failed} guides`);
  console.log('='.repeat(60));
  
  if (success === guideIds.length) {
    console.log('\n🎉 All guides now have AI-generated profile photos!');
    console.log('📸 Photos will display on guide profiles and community pages.');
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run the update
updateGuidePhotos().catch(err => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});
