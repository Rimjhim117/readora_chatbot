const books = [
  { title: "Twilight", author: "Stephenie Meyer" },
  { title: "Dracula", author: "Bram Stoker" },
  { title: "The Fault in Our Stars", author: "John Green" }
];

async function test() {
  for (const book of books) {
    try {
      const query = `intitle:${encodeURIComponent(book.title)}+inauthor:${encodeURIComponent(book.author)}`;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;
      console.log(`Querying Google Books: ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`Failed for ${book.title}: ${res.status}`);
        continue;
      }
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const volumeInfo = data.items[0].volumeInfo;
        const thumbnail = volumeInfo.imageLinks ? (volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail) : null;
        console.log(`Result for ${book.title}: Title = "${volumeInfo.title}", Cover URL = ${thumbnail}`);
      } else {
        console.log(`No items found for ${book.title}`);
      }
    } catch (e) {
      console.error(`Error for ${book.title}:`, e);
    }
  }
}

test();
