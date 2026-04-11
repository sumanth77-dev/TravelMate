/**
 * Update guide profile photos via backend API
 * This script reads the generated photo URLs and updates the database through the API
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const PHOTOS_FILE = path.join(__dirname, 'guide_photo_urls.json');

// Read the generated photo URLs
const photoData = JSON.parse(fs.readFileSync(PHOTOS_FILE, 'utf8'));

console.log('🚀 Updating guide profile photos via API...\n');
console.log(`📸 Total guides to update: ${Object.keys(photoData.photoUrls).length}\n`);

// Update each guide via HTTP request
async function updateGuidesViaAPI() {
  let success = 0;
  let failed = 0;
  const guideIds = Object.keys(photoData.photoUrls);
  
  for (const guideId of guideIds) {
    try {
      const photoUrl = photoData.photoUrls[guideId];
      
      process.stdout.write(`[${Object.keys(photoData.photoUrls).indexOf(guideId) + 1}/${guideIds.length}] ⏳ Guide #${guideId}...`);
      
      // Make HTTP request to update via API
      await updateGuidePhoto(parseInt(guideId), photoUrl);
      
      console.log(' ✅');
      success++;
      
      // Small delay between requests
      await new Promise(r => setTimeout(r, 100));
      
    } catch (err) {
      console.log(` ❌ (${err.message})`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
  console.log('='.repeat(60));
  
  if (failed === 0) {
    console.log('\n🎉 All guides updated with profile photos!');
    console.log('📸 Photos are now live and visible on the guides pages.');
  }
}

// HTTP request to update guide photo
function updateGuidePhoto(guideId, photoUrl) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      profile_photo: photoUrl
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api/guides/${guideId}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Run updates
updateGuidesViaAPI().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
