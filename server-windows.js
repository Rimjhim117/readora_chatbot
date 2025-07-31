// Simple Windows-compatible server for Readora
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple book data (your 50 books)
const books = [
  { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", mood: "fantasy", description: "A young wizard's first year at Hogwarts", rating: 4.9 },
  { id: 2, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", mood: "romance", description: "Love and misunderstandings in Regency England", rating: 4.9 },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", mood: "sci-fi", description: "Power politics and sandworms on a desert planet", rating: 4.9 },
  { id: 4, title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", mood: "thriller", description: "A woman's disappearance hides sinister secrets", rating: 4.5 },
  { id: 5, title: "It", author: "Stephen King", genre: "Horror", mood: "horror", description: "A shape-shifting clown haunts a group of friends", rating: 4.5 },
  { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", mood: "fantasy", description: "A hobbit's epic quest to reclaim a lost kingdom", rating: 4.4 },
  { id: 7, title: "The Notebook", author: "Nicholas Sparks", genre: "Romance", mood: "romance", description: "A timeless love story spanning decades", rating: 4.5 },
  { id: 8, title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", mood: "sci-fi", description: "An astronaut survives alone on Mars", rating: 4.5 }
];

// Mood to genre mapping
const moodToGenre = {
  'sad': 'Romance',
  'happy': 'Fantasy', 
  'angry': 'Thriller',
  'curious': 'Sci-Fi',
  'romantic': 'Romance',
  'adventurous': 'Fantasy',
  'scared': 'Horror'
};

// Local message processing
function processMessage(message) {
  const text = message.toLowerCase();
  let mood = null;
  let genre = null;
  let response = "I'd love to help you find the perfect book!";

  // Detect mood
  if (text.includes('sad')) {
    mood = 'sad';
    response = "I understand you're feeling sad. Sometimes a good romance can help lift your spirits.";
  } else if (text.includes('happy')) {
    mood = 'happy';
    response = "That's wonderful! How about some exciting fantasy adventures to match your mood?";
  } else if (text.includes('angry')) {
    mood = 'angry';
    response = "I can sense some frustration. Perhaps a thrilling book might help!";
  }

  // Detect genre requests
  if (text.includes('fantasy')) genre = 'Fantasy';
  else if (text.includes('romance')) genre = 'Romance';
  else if (text.includes('thriller')) genre = 'Thriller';
  else if (text.includes('sci-fi')) genre = 'Sci-Fi';
  else if (text.includes('horror')) genre = 'Horror';

  // Map mood to genre if no direct genre
  if (!genre && mood) {
    genre = moodToGenre[mood];
  }

  return { response, mood, genre };
}

// Chat API
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const result = processMessage(message);
  
  // Get book recommendations
  let recommendedBooks = [];
  if (result.genre) {
    recommendedBooks = books
      .filter(book => book.genre === result.genre)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
  }

  res.json({
    response: result.response,
    books: recommendedBooks,
    context: { mood: result.mood, genre: result.genre }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', booksLoaded: books.length });
});

// Serve static files
app.use(express.static('client'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start server on localhost (Windows-compatible)
const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Readora is running at http://localhost:${PORT}`);
  console.log(`📚 Loaded ${books.length} books`);
});