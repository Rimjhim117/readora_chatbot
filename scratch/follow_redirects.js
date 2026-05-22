const https = require('https');

function followRedirect(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log(`  Redirecting to: ${res.headers.location}`);
        resolve(followRedirect(res.headers.location));
      } else {
        console.log(`  Final Headers:`);
        console.log(`    Content-Type: ${res.headers['content-type']}`);
        console.log(`    Content-Length: ${res.headers['content-length']}`);
        resolve(res.statusCode);
      }
    }).on('error', (err) => {
      console.error(`Error:`, err.message);
      resolve(null);
    });
  });
}

async function run() {
  console.log('--- Checking Twilight ---');
  await followRedirect('https://covers.openlibrary.org/b/id/12641977-M.jpg');
  console.log('\n--- Checking Dracula ---');
  await followRedirect('https://covers.openlibrary.org/b/id/12216503-M.jpg');
  console.log('\n--- Checking The Fault in Our Stars ---');
  await followRedirect('https://covers.openlibrary.org/b/id/7418786-M.jpg');
}

run();
