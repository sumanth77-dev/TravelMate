const https = require('https');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const UPLOAD_DIR = path.join(__dirname, 'uploads', 'profile_photos');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('📁 Created uploads/profile_photos directory');
}

// Avatar generator with multiple styles
const getAvatarUrl = (name, guideId) => {
  const styles = [
    'pixel-art',
    'avataaars',
    'personas',
    'bottts'
  ];
  
  const style = styles[guideId % styles.length];
  return `https://api.dicebear.com/7.x/${style}/png?seed=${guideId}&scale=90&backgroundColor=random`;
};

// Download image with timeout
async function downloadImage(imageUrl, filePath, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timeoutHandle = setTimeout(() => {
      reject(new Error('Download timeout'));
    }, timeout);
    
    const file = fs.createWriteStream(filePath);
    
    https.get(imageUrl, (response) => {
      clearTimeout(timeoutHandle);
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🚀 Starting guide photo generation...\n');
  
  let conn;
  try {
    // Create fresh connection
    console.log('⏳ Connecting to database...');
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'travel_explorer'
    });
    console.log('✅ Connected\n');
    
    // Fetch guides
    console.log('⏳ Fetching guides...');
    const [guides] = await conn.execute(`
      SELECT g.id, u.full_name 
      FROM guides g
      JOIN users u ON g.user_id = u.id
      WHERE g.is_approved = 1
      LIMIT 50
    `);
    
    console.log(`✅ Found ${guides.length} guides\n`);
    
    if (!guides.length) {
      console.log('⚠️  No approved guides found');
      await conn.end();
      return;
    }
    
    let success = 0;
    let failed = 0;
    
    for (let i = 0; i < guides.length; i++) {
      const g = guides[i];
      try {
        const name = g.full_name.replace(/\s+/g, '_');
        const url = getAvatarUrl(name, g.id);
        const file = `guide_${g.id}_${name}.png`;
        const filepath = path.join(UPLOAD_DIR, file);
        
        process.stdout.write(`[${i+1}/${guides.length}] ⏳ ${g.full_name.substring(0, 30)}...`);
        
        await downloadImage(url, filepath);
        
        const photoPath = `uploads/profile_photos/${file}`;
        await conn.execute('UPDATE guides SET profile_photo = ? WHERE id = ?', [photoPath, g.id]);
        
        console.log(' ✅');
        success++;
        
        await new Promise(r => setTimeout(r, 200));
        
      } catch (err) {
        console.log(` ❌ (${err.message})`);
        failed++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Success: ${success} | ❌ Failed: ${failed}`);
    console.log('='.repeat(60));
    
    await conn.end();
    process.exit(0);
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (conn) await conn.end();
    process.exit(1);
  }
}

main();
