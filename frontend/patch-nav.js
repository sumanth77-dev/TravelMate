const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We know every file has: <ul class="nav-links" id="navLinks">
  // We want to safely insert the Destinations link inside this UL block, right after Find Guides.
  
  if (!content.includes('"destinations.html">Destinations')) {
      // Find the "Find Guides" anchor tag and its closing </li>
      const fgIndex = content.indexOf('Find Guides</a></li>');
      
      if (fgIndex !== -1) {
          const insertPosition = fgIndex + 'Find Guides</a></li>'.length;
          const newLink = '\n        <li><a href="destinations.html">Destinations</a></li>';
          
          content = content.slice(0, insertPosition) + newLink + content.slice(insertPosition);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Successfully injected into ${file}`);
      }
  }
});
