async function test() {
  const artworkUrl = "https://is1-ssl.mzstatic.com/image/thumb/Publication221/v4/d2/f7/55/d2f75568-9096-78ab-e5f2-997326867096/9780316007443.jpg/100x100bb.jpg";
  
  // Replace the size suffix with 400x600bb.jpg or similar
  const highResUrl = artworkUrl.replace(/\/100x100[a-z]*.jpg$/, '/400x600bb.jpg');
  console.log(`Original: ${artworkUrl}`);
  console.log(`High-Res: ${highResUrl}`);
  
  try {
    const res = await fetch(highResUrl);
    console.log(`Fetch high-res status: ${res.status}`);
  } catch (e) {
    console.error(e);
  }
}

test();
