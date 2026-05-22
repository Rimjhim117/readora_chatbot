const fs = require('fs');
const path = require('path');

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(dest, buffer);
}

async function run() {
  const dest = path.join(__dirname, 'twilight_test_fetch.jpg');
  console.log(`Downloading Twilight cover via fetch to: ${dest}`);
  try {
    await downloadImage('https://covers.openlibrary.org/b/id/12641977-M.jpg', dest);
    console.log('Download complete! File size:', fs.statSync(dest).size);
  } catch (e) {
    console.error('Download failed:', e.message);
  }
}

run();
