async function test() {
  const books = [
    { title: "Twilight", author: "Stephenie Meyer" },
    { title: "Dracula", author: "Bram Stoker" },
    { title: "The Fault in Our Stars", author: "John Green" }
  ];

  for (const book of books) {
    const url = `http://localhost:5050/api/cover?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`;
    console.log(`Querying local server: ${url}`);
    try {
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Result:`, JSON.stringify(data, null, 2));
      }
    } catch (e) {
      console.error(e);
    }
  }
}

test();
