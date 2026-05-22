async function test() {
  const books = [
    { title: "Twilight", author: "Stephenie Meyer" },
    { title: "Dracula", author: "Bram Stoker" },
    { title: "The Fault in Our Stars", author: "John Green" }
  ];

  for (const book of books) {
    const term = `${book.title} ${book.author}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=ebook&limit=1`;
    console.log(`Querying iTunes: ${url}`);
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Results: ${data.resultCount}`);
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          console.log(`  Title: ${result.trackName}`);
          console.log(`  Artist: ${result.artistName}`);
          console.log(`  Artwork: ${result.artworkUrl100}`);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
}

test();
