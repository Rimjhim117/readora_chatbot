const books = [
  { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling" },
  { title: "The Hobbit", author: "J.R.R. Tolkien" },
  { title: "Dune", author: "Frank Herbert" },
  { title: "Pride and Prejudice", author: "Jane Austen" }
];

async function test() {
  for (const book of books) {
    try {
      const query = `title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`;
      const url = `https://openlibrary.org/search.json?${query}&limit=1`;
      console.log(`Querying: ${url}`);
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`Failed for ${book.title}: ${res.status}`);
        continue;
      }
      const data = await res.json();
      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        console.log(`Result for ${book.title}: Cover ID = ${doc.cover_i}`);
      } else {
        console.log(`No documents found for ${book.title}`);
      }
    } catch (e) {
      console.error(`Error for ${book.title}:`, e);
    }
  }
}

test();
