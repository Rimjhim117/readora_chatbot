const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const fs = require('fs');

const app = express();

// Enable JSON parser and URL encoder
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for frontend API calls
const cors = require('cors');
app.use(cors());

// Serve static React production build assets
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

// Fallback book database in case CSV is missing
const fallbackBooks = [
  { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", mood: "fantasy", description: "A young wizard's first year at Hogwarts School of Witchcraft and Wizardry.", rating: 4.9 },
  { id: 2, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", mood: "romance", description: "Love and misunderstandings in Regency England.", rating: 4.9 },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", mood: "sci-fi", description: "Power, politics, and prophecy on the desert planet Arrakis.", rating: 4.9 },
  { id: 4, title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", mood: "thriller", description: "A woman's disappearance reveals sinister truths about marriage and media.", rating: 4.5 },
  { id: 5, title: "It", author: "Stephen King", genre: "Horror", mood: "horror", description: "A shape-shifting entity terrorizes children in the town of Derry.", rating: 4.5 }
];

let books = [];

// Parse double-quote safe CSV file
function parseBooksCSV() {
  const csvPath = path.join(__dirname, 'Readora_RealBooks_Part2.csv');
  if (!fs.existsSync(csvPath)) {
    console.warn('⚠️ Readora_RealBooks_Part2.csv not found in backend directory. Using fallbacks.');
    return fallbackBooks;
  }

  try {
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split(/\r?\n/);
    const parsedBooks = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const row = [];
      let inQuotes = false;
      let currentValue = '';

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      row.push(currentValue.trim());

      // Format: id, title, author, genre, mood, description, rating
      if (row.length >= 7) {
        const cleanRow = row.map(val => val.replace(/^"|"$/g, '').trim());
        parsedBooks.push({
          id: parseInt(cleanRow[0]) || i,
          title: cleanRow[1],
          author: cleanRow[2],
          genre: cleanRow[3],
          mood: cleanRow[4],
          description: cleanRow[5],
          rating: parseFloat(cleanRow[6]) || 4.5
        });
      }
    }

    console.log(`📚 Loaded ${parsedBooks.length} books from Readora_RealBooks_Part2.csv`);
    return parsedBooks.length > 0 ? parsedBooks : fallbackBooks;
  } catch (error) {
    console.error('❌ Failed to parse CSV:', error);
    return fallbackBooks;
  }
}

// Load database
books = parseBooksCSV();

// Watson credentials from environment
const watsonApiKey = process.env.WATSON_APIKEY;
const watsonUrl = process.env.WATSON_URL || 'https://api.au-syd.assistant.watson.cloud.ibm.com';
const watsonAssistantId = process.env.WATSON_ASSISTANT_ID || 'c290e3b0-8c4d-4f2a-8f84-bfb6540518ac';

// Web chat configuration endpoints for client integration
const webChatConfig = {
  integrationID: process.env.WATSON_INTEGRATION_ID || "b41fbb14-62ff-4ac9-b2b9-4b7df57e7344",
  region: process.env.WATSON_REGION || "au-syd",
  serviceInstanceID: process.env.WATSON_SERVICE_INSTANCE_ID || "7927b76c-9f7b-479c-a340-17d48e0c3ce7"
};

// Initialize SDK if key is provided (for backend REST API usage)
let assistant = null;
let useWatsonSDK = false;

if (watsonApiKey && watsonApiKey !== 'your_api_key_here') {
  try {
    const AssistantV2 = require('ibm-watson/assistant/v2');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    assistant = new AssistantV2({
      version: '2021-11-27',
      authenticator: new IamAuthenticator({
        apikey: watsonApiKey,
      }),
      serviceUrl: watsonUrl,
    });
    useWatsonSDK = true;
    console.log('🤖 IBM Watson Assistant SDK initialized for backend REST calls.');
  } catch (e) {
    console.error('❌ Could not start IBM Watson Assistant SDK:', e);
  }
}

// Recommendation categories selector
function getBookRecommendations(genre) {
  if (!genre || genre.toLowerCase() === 'all' || genre.toLowerCase() === 'random') {
    return [...books].sort(() => Math.random() - 0.5).slice(0, 3);
  }
  
  const matched = books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
  if (matched.length === 0) {
    return [...books].sort(() => Math.random() - 0.5).slice(0, 3);
  }
  return matched.sort(() => Math.random() - 0.5).slice(0, 3);
}

// API: Get books
app.get('/api/books', (req, res) => {
  const genre = req.query.genre || 'All';
  const recommended = getBookRecommendations(genre);
  res.json({ books: recommended });
});

const coverCache = {};

// API: Proxy book cover fetching from iTunes Search API
app.get('/api/cover', async (req, res) => {
  const { title, author } = req.query;
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  const cacheKey = `${title.trim().toLowerCase()}-${author.trim().toLowerCase()}`;
  if (coverCache[cacheKey] !== undefined) {
    console.log(`[Cover Proxy] Serving memory-cached cover for "${title}"`);
    return res.json({ coverUrl: coverCache[cacheKey] });
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  try {
    const term = `${title} ${author}`;
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=ebook&limit=1`;
    
    console.log(`[Cover Proxy] Querying iTunes for "${title}" by ${author}`);
    const apiRes = await fetch(url, { headers });
    
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.results && data.results.length > 0) {
        const artworkUrl = data.results[0].artworkUrl100;
        if (artworkUrl) {
          // Upgrade size suffix from 100x100 to 400x600
          let coverUrl = artworkUrl;
          const parts = artworkUrl.split('/');
          const lastSegment = parts[parts.length - 1];
          if (/\d+x\d+/.test(lastSegment)) {
            parts[parts.length - 1] = '400x600bb.jpg';
            coverUrl = parts.join('/');
          }
          coverUrl = coverUrl.replace(/^http:/, 'https:');
          console.log(`[Cover Proxy] Found cover from iTunes: ${coverUrl}`);
          coverCache[cacheKey] = coverUrl;
          return res.json({ coverUrl });
        }
      }
    } else {
      console.warn(`[Cover Proxy] iTunes primary request failed with status: ${apiRes.status}`);
    }

    // Fallback: search without book author (only title)
    console.log(`[Cover Proxy] Falling back to title-only iTunes search for "${title}"`);
    const fallbackUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=ebook&limit=1`;
    const fallbackRes = await fetch(fallbackUrl, { headers });
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (data.results && data.results.length > 0) {
        const artworkUrl = data.results[0].artworkUrl100;
        if (artworkUrl) {
          let coverUrl = artworkUrl;
          const parts = artworkUrl.split('/');
          const lastSegment = parts[parts.length - 1];
          if (/\d+x\d+/.test(lastSegment)) {
            parts[parts.length - 1] = '400x600bb.jpg';
            coverUrl = parts.join('/');
          }
          coverUrl = coverUrl.replace(/^http:/, 'https:');
          console.log(`[Cover Proxy] Found cover from iTunes (fallback): ${coverUrl}`);
          coverCache[cacheKey] = coverUrl;
          return res.json({ coverUrl });
        }
      }
    } else {
      console.warn(`[Cover Proxy] iTunes fallback request failed with status: ${fallbackRes.status}`);
    }

    console.log(`[Cover Proxy] No cover found for "${title}"`);
    coverCache[cacheKey] = null;
    res.json({ coverUrl: null });
  } catch (err) {
    console.error('Error in backend cover proxy:', err);
    res.status(500).json({ error: 'Failed to retrieve cover' });
  }
});

// API: Watson Widget config
app.get('/api/watson-config', (req, res) => {
  res.json(webChatConfig);
});

// API: Health status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    booksCount: books.length,
    backendWatsonSDK: useWatsonSDK,
    version: '2.0.0'
  });
});

// Serve frontend routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Express Backend running at http://localhost:${PORT}`);
  console.log(`📚 Real books database successfully active`);
  console.log(`💬 Watson Web Chat integration active (Region: ${webChatConfig.region})`);
  console.log(`======================================================\n`);
});
