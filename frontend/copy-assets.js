const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\sumanth\\.gemini\\antigravity\\brain\\31f2ff80-fc58-4ee4-9b55-852e0b400981';
const destDir = 'c:\\Users\\sumanth\\Desktop\\1TravelMate\\frontend\\assets';

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir);
}

const files = {
    'guide_aarav.png': 'guide_aarav_1774791344403.png',
    'guide_priya.png': 'guide_priya_1774791363947.png',
    'guide_ravi.png': 'guide_ravi_1774791451379.png',
    'guide_meera.png': 'guide_meera_1774791473550.png'
};

for (const [destName, srcName] of Object.entries(files)) {
    const srcPath = path.join(srcDir, srcName);
    const destPath = path.join(destDir, destName);
    if(fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${srcName} to ${destName}`);
    } else {
        console.log(`Source not found: ${srcPath}`);
    }
}
console.log('Done copying!');
