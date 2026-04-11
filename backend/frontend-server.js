const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const FRONTEND_DIR = path.join(__dirname, '../frontend');

const server = http.createServer((req, res) => {
  // Remove query string from URL
  let url = req.url.split('?')[0];
  // Default to index.html if accessing root or directory
  let filePath = path.join(FRONTEND_DIR, url === '/' ? 'index.html' : url);
  
  // Prevent directory traversal
  if (!path.resolve(filePath).startsWith(FRONTEND_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Page Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       ✅ Travel Mate Frontend Server Running              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏠 Frontend: ${FRONTEND_DIR}`);
  console.log('\n🔗 Visit these pages:\n');
  console.log(`   🏠 Home:       http://localhost:${PORT}/index.html`);
  console.log(`   🗺️  Community:  http://localhost:${PORT}/main_community.html`);
  console.log(`   🎒 Guides:     http://localhost:${PORT}/findguides.html`);
  console.log(`   ✈️  Bali:        http://localhost:${PORT}/community.html?place=bali`);
  console.log(`   ⛰️  Swiss:       http://localhost:${PORT}/community.html?place=swiss`);
  console.log(`   🗼 Tokyo:       http://localhost:${PORT}/community.html?place=tokyo`);
  console.log(`   🎌 Kyoto:       http://localhost:${PORT}/community.html?place=kyoto`);
  console.log(`   🗽 Paris:       http://localhost:${PORT}/community.html?place=paris`);
  console.log(`   🏖️  Maldives:    http://localhost:${PORT}/community.html?place=maldives`);
  console.log('\n✋ Press Ctrl+C to stop server\n');
});
