const https = require('https');
const fs = require('fs');
const path = require('path');

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    function get(url) {
      https.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          get(response.headers.location);
        } else if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        } else {
          reject(new Error(`Status: ${response.statusCode}`));
        }
      }).on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }

    get(url);
  });
}

async function run() {
  const dest = path.join(__dirname, 'twilight_test.jpg');
  console.log(`Downloading Twilight cover to: ${dest}`);
  try {
    await downloadImage('https://covers.openlibrary.org/b/id/12641977-M.jpg', dest);
    console.log('Download complete! File size:', fs.statSync(dest).size);
  } catch (e) {
    console.error('Download failed:', e.message);
  }
}

run();
