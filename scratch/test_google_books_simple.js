async function test() {
  const query = encodeURIComponent("Twilight Stephenie Meyer");
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
  console.log(`Querying Google Books: ${url}`);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log(`Results length: ${data.items ? data.items.length : 0}`);
      if (data.items && data.items.length > 0) {
        console.log(`First item:`, JSON.stringify(data.items[0].volumeInfo, null, 2));
      }
    }
  } catch (e) {
    console.error(e);
  }
}

test();
