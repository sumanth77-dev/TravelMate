/**
 * Generate AI profile photos for guides using external avatar API
 * Stores the photo URLs directly in the frontend so guides display with images immediately
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Avatar generator
const getAvatarUrl = (guideId) => {
  const styles = ['pixel-art', 'avataaars', 'personas', 'bottts', 'lorelei'];
  const style = styles[guideId % styles.length];
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${guideId}&scale=90&backgroundColor=random`;
};

// List of realistic names for seed diversity
const guides = [
  { id: 3, name: 'Kenji Tanaka' },
  { id: 5, name: 'Takeshi Yamamoto' },
  { id: 9, name: 'Yuki Tanaka' },
  { id: 10, name: 'Hana Suzuki' },
  { id: 11, name: 'Made Wijaya' },
  { id: 12, name: 'Ketut Buana' },
  { id: 13, name: 'Wayan Sudirta' },
  { id: 14, name: 'Sophie Laurent' },
  { id: 15, name: 'Pierre Dubois' },
  { id: 16, name: 'Hans Mueller' },
  { id: 17, name: 'Maria Schmidt' },
  { id: 18, name: 'Anna Friedrich' },
  { id: 19, name: 'Ahmed Hassan' },
  { id: 20, name: 'Fathimath Ali' },
  { id: 21, name: 'Rasheed Ibrahim' },
  { id: 22, name: 'Arun Prabhu' },
  { id: 23, name: 'Priya Nair' },
  { id: 24, name: 'Vikram Singh' },
  { id: 25, name: 'Deepika Sharma' },
  { id: 26, name: 'Rajesh Kumar' },
  { id: 27, name: 'Anjali Verma' },
  { id: 28, name: 'Jack Holden' },
  { id: 29, name: 'Sarah Wilson' },
  { id: 30, name: 'Elena Rossi' },
  { id: 31, name: 'Marco Santoro' },
  { id: 32, name: 'Luigi Bianchi' },
  { id: 33, name: 'Sophia Martinez' },
  { id: 34, name: 'Aarav Sharma' },
  { id: 35, name: 'Priya Patel' },
  { id: 36, name: 'Ravi Singh' },
  { id: 37, name: 'Neha Kapoor' },
  { id: 38, name: '李明' },
  { id: 39, name: 'Zhang Wei' },
  { id: 40, name: 'Liu Yang' },
  { id: 41, name: 'Chen Ming' },
  { id: 42, name: 'Nguyễn Anh' },
  { id: 43, name: 'Tran Hung' },
  { id: 44, name: 'Pham Chi' },
  { id: 45, name: 'Hoang Minh' },
  { id: 46, name: 'Carlos López' },
  { id: 47, name: 'Juan García' },
  { id: 48, name: 'María González' },
  { id: 49, name: 'Anna Nielsen' },
  { id: 50, name: 'Lars Larsson' },
  { id: 51, name: 'Sofia Andersson' },
  { id: 52, name: 'Erik Johnson' },
  { id: 53, name: 'Emma Watson' },
  { id: 54, name: 'James Thompson' },
  { id: 55, name: 'Sophia Taylor' }
];

console.log('📸 Guide Profile Photo URLs Generated\n');
console.log('Use these URLs to update guide profiles in the frontend or database:\n');

let count = 0;
guides.forEach(guide => {
  const url = getAvatarUrl(guide.id);
  console.log(`Guide #${guide.id.toString().padStart(2, '0')}: ${guide.name.padEnd(20, ' ')} - ${url}`);
  count++;
});

// Also create a JavaScript object for easy import
const photoData = {
  generated: new Date().toISOString(),
  totalGuides: count,
  photoUrls: guides.reduce((acc, g) => {
    acc[g.id] = getAvatarUrl(g.id);
    return acc;
  }, {})
};

// Save to file for reference
const outputPath = path.join(__dirname, 'guide_photo_urls.json');
fs.writeFileSync(outputPath, JSON.stringify(photoData, null, 2));

console.log(`\n✅ Photo URLs saved to: ${outputPath}`);
console.log(`\n📊 Total guides: ${count}`);
console.log(`\n💡 Next step: Use one of these approaches:`);
console.log(`   1. Update database profile_photo column with these URLs`);
console.log(`   2. Or use them directly in frontend by fetching from guide-profile.html`);
console.log(`\n🎨 Avatar Services Used:`);
console.log(`   - pixel-art (colorful pixel avatars)`);
console.log(`   - avataaars (diverse human-like avatars)`);
console.log(`   - personas (illustrated personas)`);
console.log(`   - bottts (robot-like characters)`);
console.log(`   - lorelei (gradient-based avatars)`);
