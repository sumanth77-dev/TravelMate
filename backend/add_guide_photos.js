const https = require('https');
const fs = require('fs');
const path = require('path');

// Use the existing db config
const pool = require('./config/db');

const UPLOAD_DIR = path.join(__dirname, 'uploads', 'profile_photos');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('📁 Created uploads/profile_photos directory');
}

// List of high-quality AI avatar services - using various realistic avatar generators
const getAvatarUrl = (name, guideId) => {
  // Use multiple avatar services for variety and reliability
  const services = [
    // Style 1: Pixelart avatars (consistent and fun)
    () => `https://api.dicebear.com/7.x/pixel-art/png?seed=${guideId}&scale=90&backgroundColor=random`,
    // Style 2: Avataaars (diverse and realistic)
    () => `https://api.dicebear.com/7.x/avataaars/png?seed=${guideId}&scale=90&backgroundColor=random`,
    // Style 3: Personas (realistic portraits)
    () => `https://api.dicebear.com/7.x/personas/png?seed=${guideId}&scale=90&backgroundColor=random`,
    // Style 4: Bottts (unique characters)
    () => `https://api.dicebear.com/7.x/bottts/png?seed=${guideId}&scale=90&backgroundColor=random`,
  ];
  
  // Pick a service based on guide ID for variety
  const serviceIndex = guideId % services.length;
  return services[serviceIndex]();
};

// Download image from URL
async function downloadImage(imageUrl, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', reject);
  });
};

// Main function
async function addProfilePhotosToGuides() {
  let connection;
  
  try {
    // Get connection from pool
    console.log('⏳ Connecting to database...');
    connection = await pool.getConnection();
    console.log('✅ Connected to database\n');
    
    // Get all guides with their user names
    console.log('⏳ Fetching guides...');
    const [guides] = await connection.query(`
      SELECT g.id, u.full_name 
      FROM guides g
      JOIN users u ON g.user_id = u.id
      WHERE g.is_approved = 1
    `);
    
    if (!guides || !guides.length) {
      console.log('⚠️  No guides found in database');
      connection.release();
      return;
    }
    
    console.log(`✅ Found ${guides.length} guides\n`);
    console.log(`📸 Generating profile photos for ${guides.length} guides...\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    // Process each guide
    for (let i = 0; i < guides.length; i++) {
      const guide = guides[i];
      try {
        const guideId = guide.id;
        const guideName = guide.full_name.replace(/\s+/g, '_');
        
        // Generate avatar URL using realistic AI avatar service
        const avatarUrl = getAvatarUrl(guideName, guideId);
        
        const fileName = `guide_${guideId}_${guideName}.png`;
        const filePath = path.join(UPLOAD_DIR, fileName);
        
        // Download image
        console.log(`[${i+1}/${guides.length}] ⏳ Downloading for ${guide.full_name}...`);
        await downloadImage(avatarUrl, filePath);
        
        // Store the relative path in database
        const profilePhotoPath = `uploads/profile_photos/${fileName}`;
        
        // Update guide with profile photo path
        await connection.query(
          'UPDATE guides SET profile_photo = ? WHERE id = ?',
          [profilePhotoPath, guideId]
        );
        
        console.log(`✅ Guide #${guideId}: ${guide.full_name}`);
        console.log(`   📁 Saved: ${fileName}\n`);
        
        successCount++;
        
        // Rate limiting - add small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (err) {
        failCount++;
        console.error(`❌ Error processing guide #${guide.id}: ${err.message}\n`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   ✅ Successfully updated: ${successCount} guides`);
    console.log(`   ❌ Failed: ${failCount} guides`);
    console.log(`   📁 Images stored in: ${UPLOAD_DIR}`);
    console.log('='.repeat(60));
    
    connection.release();
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Fatal Error:', err.message);
    console.error(err.stack);
    if (connection) connection.release();
    process.exit(1);
  }
}

// Run the function
addProfilePhotosToGuides();
