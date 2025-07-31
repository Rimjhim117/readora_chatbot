const express = require('express');
const app = express();
app.use(express.json());

// Your complete 50-book database
const books = [
  // Fantasy Books
  { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", description: "A young wizard's first year at Hogwarts School of Witchcraft and Wizardry", rating: 4.9 },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", description: "A hobbit's unexpected journey to reclaim a lost kingdom", rating: 4.4 },
  { id: 3, title: "Mistborn: The Final Empire", author: "Brandon Sanderson", genre: "Fantasy", description: "A thief discovers her magical powers in a world of ash and mist", rating: 4.5 },
  { id: 4, title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", description: "Noble families vie for control of the Iron Throne in Westeros", rating: 4.5 },
  { id: 5, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", description: "A gifted boy grows into a legendary figure of magic and music", rating: 4.0 },
  { id: 6, title: "Eragon", author: "Christopher Paolini", genre: "Fantasy", description: "A farm boy discovers a dragon egg and his destiny as a Dragon Rider", rating: 4.7 },
  { id: 7, title: "The Way of Kings", author: "Brandon Sanderson", genre: "Fantasy", description: "An epic tale of honor, war, and magic in a storm-ravaged world", rating: 4.8 },
  { id: 8, title: "The Last Wish", author: "Andrzej Sapkowski", genre: "Fantasy", description: "Tales of Geralt of Rivia, a monster hunter for hire", rating: 4.3 },
  { id: 9, title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", genre: "Fantasy", description: "Four siblings discover the magical world of Narnia through a wardrobe", rating: 4.5 },
  { id: 10, title: "Percy Jackson & the Lightning Thief", author: "Rick Riordan", genre: "Fantasy", description: "A boy discovers he's the son of a Greek god in modern America", rating: 4.8 },

  // Romance Books
  { id: 11, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", description: "Love and misunderstandings in Regency England", rating: 4.9 },
  { id: 12, title: "The Notebook", author: "Nicholas Sparks", genre: "Romance", description: "A timeless love story that spans decades through memory and devotion", rating: 4.5 },
  { id: 13, title: "Me Before You", author: "Jojo Moyes", genre: "Romance", description: "A quirky caretaker transforms the life of a paralyzed man", rating: 4.5 },
  { id: 14, title: "Outlander", author: "Diana Gabaldon", genre: "Romance", description: "A WWII nurse time-travels to 18th century Scotland and finds love", rating: 4.5 },
  { id: 15, title: "Twilight", author: "Stephenie Meyer", genre: "Romance", description: "A teenage girl falls for a mysterious vampire, changing her world forever", rating: 4.0 },
  { id: 16, title: "The Fault in Our Stars", author: "John Green", genre: "Romance", description: "Two teens with cancer bond over humor, philosophy, and love", rating: 4.5 },
  { id: 17, title: "To All the Boys I've Loved Before", author: "Jenny Han", genre: "Romance", description: "Secret love letters accidentally sent change everything for Lara Jean", rating: 4.5 },
  { id: 18, title: "Red, White & Royal Blue", author: "Casey McQuiston", genre: "Romance", description: "Enemies-to-lovers romance between the First Son and a British Prince", rating: 4.5 },
  { id: 19, title: "It Ends With Us", author: "Colleen Hoover", genre: "Romance", description: "A woman's complex relationships force her to confront difficult truths", rating: 4.5 },
  { id: 20, title: "Beach Read", author: "Emily Henry", genre: "Romance", description: "Two rival writers challenge each other to write outside their comfort zones", rating: 4.5 },

  // Sci-Fi Books
  { id: 21, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", description: "Power, politics, and prophecy on the desert planet Arrakis", rating: 4.9 },
  { id: 22, title: "Ender's Game", author: "Orson Scott Card", genre: "Sci-Fi", description: "A child genius is trained in military strategy to save humanity", rating: 4.5 },
  { id: 23, title: "Neuromancer", author: "William Gibson", genre: "Sci-Fi", description: "The cyberpunk novel that defined a genre and predicted the internet", rating: 4.5 },
  { id: 24, title: "Snow Crash", author: "Neal Stephenson", genre: "Sci-Fi", description: "A hacker uncovers a digital virus with ancient linguistic roots", rating: 4.5 },
  { id: 25, title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", description: "An astronaut uses science and humor to survive alone on Mars", rating: 4.5 },
  { id: 26, title: "Ready Player One", author: "Ernest Cline", genre: "Sci-Fi", description: "A VR treasure hunt in a dystopian future obsessed with 80s culture", rating: 4.5 },
  { id: 27, title: "Project Hail Mary", author: "Andy Weir", genre: "Sci-Fi", description: "A lone scientist must save Earth from extinction using unlikely allies", rating: 4.5 },
  { id: 28, title: "Foundation", author: "Isaac Asimov", genre: "Sci-Fi", description: "A mathematician predicts and fights the fall of a galactic empire", rating: 4.5 },
  { id: 29, title: "Hyperion", author: "Dan Simmons", genre: "Sci-Fi", description: "Seven pilgrims journey to a mysterious world, each revealing their story", rating: 4.5 },
  { id: 30, title: "Old Man's War", author: "John Scalzi", genre: "Sci-Fi", description: "The elderly are recruited and enhanced for interstellar warfare", rating: 4.5 },

  // Thriller Books
  { id: 31, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Thriller", description: "A journalist and hacker uncover a wealthy family's dark secrets in Sweden", rating: 4.5 },
  { id: 32, title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", description: "A woman's disappearance reveals sinister truths about marriage and media", rating: 4.5 },
  { id: 33, title: "The Da Vinci Code", author: "Dan Brown", genre: "Thriller", description: "A symbologist races through Europe following clues to ancient secrets", rating: 4.5 },
  { id: 34, title: "The Silent Patient", author: "Alex Michaelides", genre: "Thriller", description: "A woman refuses to speak after allegedly murdering her husband", rating: 4.5 },
  { id: 35, title: "In the Woods", author: "Tana French", genre: "Thriller", description: "A detective confronts his past while investigating a child's disappearance", rating: 4.5 },
  { id: 36, title: "Before I Go to Sleep", author: "S.J. Watson", genre: "Thriller", description: "A woman with memory loss discovers disturbing truths about her life", rating: 4.5 },
  { id: 37, title: "I Am Watching You", author: "Teresa Driscoll", genre: "Thriller", description: "A woman's guilt over a witnessed conversation leads to deadly consequences", rating: 4.5 },
  { id: 38, title: "Behind Closed Doors", author: "B.A. Paris", genre: "Thriller", description: "A seemingly perfect marriage hides a chilling and dangerous secret", rating: 4.5 },
  { id: 39, title: "The Couple Next Door", author: "Shari Lapena", genre: "Thriller", description: "A baby disappears during a dinner party, exposing neighborhood secrets", rating: 4.5 },
  { id: 40, title: "The Woman in the Window", author: "A.J. Finn", genre: "Thriller", description: "An agoraphobic woman believes she witnessed a crime from her window", rating: 4.5 },

  // Horror Books
  { id: 41, title: "It", author: "Stephen King", genre: "Horror", description: "A shape-shifting entity terrorizes children in the town of Derry", rating: 4.5 },
  { id: 42, title: "The Shining", author: "Stephen King", genre: "Horror", description: "A family's winter isolation in a haunted hotel leads to madness", rating: 4.5 },
  { id: 43, title: "Bird Box", author: "Josh Malerman", genre: "Horror", description: "A mother and children survive blindfolded against unseen monsters", rating: 4.5 },
  { id: 44, title: "The Haunting of Hill House", author: "Shirley Jackson", genre: "Horror", description: "A group investigates a haunted house that preys on human psychology", rating: 4.5 },
  { id: 45, title: "Dracula", author: "Bram Stoker", genre: "Horror", description: "The classic tale of Count Dracula's vampiric reign of terror", rating: 4.5 },
  { id: 46, title: "Mexican Gothic", author: "Silvia Moreno-Garcia", genre: "Horror", description: "A socialite investigates eerie events at a crumbling English mansion in Mexico", rating: 4.5 },
  { id: 47, title: "The Exorcist", author: "William Peter Blatty", genre: "Horror", description: "A young girl becomes possessed by a demonic force", rating: 4.5 },
  { id: 48, title: "The Only Good Indians", author: "Stephen Graham Jones", genre: "Horror", description: "A haunting tale of revenge rooted in Native American culture", rating: 4.5 },
  { id: 49, title: "House of Leaves", author: "Mark Z. Danielewski", genre: "Horror", description: "A family discovers their house is larger inside than outside", rating: 4.5 },
  { id: 50, title: "Pet Sematary", author: "Stephen King", genre: "Horror", description: "A burial ground with sinister powers tests the boundaries of life and death", rating: 4.5 }
];

// Enhanced message processing with Watson-style responses
function processMessage(message) {
  const text = message.toLowerCase();
  let response = "I'd love to help you find the perfect book!";
  let genre = null;
  let mood = null;

  // Greeting check
if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
  return {
    response: "Hello! I'm Readora, your personal book recommendation assistant. Tell me how you're feeling today, or what genre interests you, and I'll suggest the perfect books for you!",
    genre: null,
    mood: null
  };
}


  // Mood detection (Watson-style)
  if (text.includes('sad') || text.includes('down') || text.includes('depressed') || text.includes('blue')) {
    mood = 'sad';
    response = "I understand you're feeling sad. Sometimes a good romance or uplifting story can help lift your spirits. Here are some heartwarming books that might brighten your day:";
    genre = "Romance";
  } else if (text.includes('happy') || text.includes('great') || text.includes('excited') || text.includes('good') || text.includes('cheerful')) {
    mood = 'happy';
    response = "That's wonderful that you're feeling happy! How about some exciting fantasy adventures to match your upbeat mood?";
    genre = "Fantasy";
  } else if (text.includes('angry') || text.includes('frustrated') || text.includes('mad') || text.includes('annoyed')) {
    mood = 'angry';
    response = "I can sense some frustration. Perhaps a thrilling book with some action might help you channel that energy productively!";
    genre = "Thriller";
  } else if (text.includes('curious') || text.includes('wondering') || text.includes('think')) {
    mood = 'curious';
    response = "Your curiosity is wonderful! Science fiction might be perfect for exploring new ideas and possibilities.";
    genre = "Sci-Fi";
  } else if (text.includes('scared') || text.includes('brave') || text.includes('adventurous')) {
    mood = 'adventurous';
    response = "Feeling brave and adventurous? Fantasy books can transport you to magical worlds full of quests and wonder!";
    genre = "Fantasy";
  }

  // Direct genre requests (Watson intent detection)
  if (text.includes('fantasy') || text.includes('magic') || text.includes('wizard') || text.includes('dragon')) {
    response = "Excellent choice! Fantasy books can transport you to magical worlds filled with adventure and wonder. Here are some enchanting recommendations:";
    genre = "Fantasy";
  } else if (text.includes('romance') || text.includes('love') || text.includes('romantic')) {
    response = "Romance is such a beautiful genre! Here are some heartwarming love stories that will touch your heart:";
    genre = "Romance";
  } else if (text.includes('thriller') || text.includes('mystery') || text.includes('suspense') || text.includes('crime')) {
    response = "Thrillers are perfect for keeping you on the edge of your seat! Here are some gripping page-turners:";
    genre = "Thriller";
  } else if (text.includes('sci-fi') || text.includes('science fiction') || text.includes('space') || text.includes('futuristic')) {
    response = "Science fiction opens up endless possibilities! Here are some mind-bending recommendations that explore the future:";
    genre = "Sci-Fi";
  } else if (text.includes('horror') || text.includes('scary') || text.includes('frightening') || text.includes('spooky')) {
    response = "Ready for some spine-chilling reads? Here are some horror recommendations that will keep you up at night:";
    genre = "Horror";
  }

  // General book requests
  if (text.includes('recommend') || text.includes('suggest') || text.includes('book') || text.includes('read')) {
    if (!genre && !mood) {
      response = "I'd love to help you discover your next great read! Here are some popular recommendations across different genres:";
    }
  }

  // Default greeting responses
  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    response = "Hello! I'm Readora, your personal book recommendation assistant. Tell me how you're feeling today, or what genre interests you, and I'll suggest the perfect books for you!";
  }

  return { response, genre, mood };
}

// Main chat API endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const result = processMessage(message);
  
  let recommendedBooks = [];
  
  if (result.genre) {
    // Get books from specific genre
    recommendedBooks = books
      .filter(book => book.genre === result.genre)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3); // Show 3 books for better selection
  } else {
    // General recommendations - mix from all genres
    recommendedBooks = books
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }

  res.json({
    response: result.response,
    books: recommendedBooks,
    context: { 
      genre: result.genre,
      mood: result.mood,
      totalBooks: books.length
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    books: books.length,
    watson: 'integrated',
    version: '2.0'
  });
});

// Main page with your beautiful Readora design
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Readora - Let your feelings guide your next read</title>
    <meta name="description" content="AI-powered book recommendation chatbot that suggests books based on your mood and preferences. Discover your next great read with Readora.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fdf2f8 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.6;
        }
        
        .container { max-width: 900px; margin: 0 auto; }
        
        .header { text-align: center; margin-bottom: 40px; }
        .logo { 
            width: 80px; height: 80px; 
            background: linear-gradient(135deg, #f472b6, #a855f7); 
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; 
            margin: 0 auto 20px; 
            box-shadow: 0 10px 25px rgba(248, 187, 217, 0.3);
            transition: transform 0.3s ease;
        }
        .logo:hover { transform: scale(1.05); }
        .logo::before { content: "📚"; font-size: 40px; }
        
        h1 { 
            font-size: 3.5rem; 
            color: #374151; 
            margin-bottom: 10px; 
            font-weight: 700;
            background: linear-gradient(135deg, #f472b6, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .tagline { 
            font-size: 1.3rem; 
            color: #6b7280; 
            margin-bottom: 30px; 
            font-weight: 400;
        }
        
        .stats {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }
        .stat {
            background: rgba(255,255,255,0.8);
            padding: 15px 25px;
            border-radius: 15px;
            text-align: center;
            min-width: 120px;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #a855f7;
            display: block;
        }
        .stat-label {
            font-size: 0.9rem;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .chat-container { 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px);
            border-radius: 24px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
            overflow: hidden; 
            margin-bottom: 30px; 
            border: 1px solid rgba(248, 187, 217, 0.3);
        }
        
        .chat-header { 
            background: linear-gradient(135deg, #f472b6, #a855f7); 
            color: white; 
            padding: 25px; 
            text-align: center; 
        }
        .chat-header h3 { font-size: 1.3rem; margin-bottom: 5px; font-weight: 600; }
        .chat-header p { opacity: 0.9; font-size: 0.95rem; }
        
        .chat-messages { 
            height: 450px; 
            overflow-y: auto; 
            padding: 25px; 
            background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
            scroll-behavior: smooth;
        }
        
        .message { 
            margin-bottom: 20px; 
            display: flex; 
            align-items: flex-start; 
            animation: slideUp 0.4s ease-out;
        }
        .message.user { justify-content: flex-end; }
        
        .message-content { 
            max-width: 75%; 
            padding: 15px 20px; 
            border-radius: 20px; 
            font-size: 0.95rem;
            line-height: 1.5;
            position: relative;
        }
        .message.user .message-content { 
            background: linear-gradient(135deg, #f472b6, #a855f7); 
            color: white; 
            border-bottom-right-radius: 8px;
        }
        .message.assistant .message-content { 
            background: #f8fafc; 
            color: #374151; 
            border-bottom-left-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .chat-input { 
            display: flex; 
            padding: 25px; 
            border-top: 1px solid rgba(248, 187, 217, 0.3); 
            background: white;
        }
        .chat-input input { 
            flex: 1; 
            padding: 15px 20px; 
            border: 2px solid #e5e7eb; 
            border-radius: 25px; 
            outline: none; 
            font-size: 0.95rem;
            transition: border-color 0.3s;
        }
        .chat-input input:focus { 
            border-color: #f472b6; 
            box-shadow: 0 0 0 3px rgba(244, 114, 182, 0.1);
        }
        .chat-input button { 
            margin-left: 15px; 
            background: linear-gradient(135deg, #f472b6, #a855f7); 
            color: white; 
            border: none; 
            padding: 15px 25px; 
            border-radius: 25px; 
            cursor: pointer; 
            font-weight: 600;
            transition: all 0.3s;
            min-width: 80px;
        }
        .chat-input button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 5px 15px rgba(244, 114, 182, 0.4);
        }
        .chat-input button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
        
        .quick-actions { 
            display: flex; 
            gap: 12px; 
            padding: 0 25px 25px; 
            flex-wrap: wrap; 
            justify-content: center;
        }
        .quick-btn { 
            background: rgba(248, 187, 217, 0.2); 
            color: #be185d; 
            border: none; 
            padding: 10px 18px; 
            border-radius: 20px; 
            cursor: pointer; 
            font-size: 14px; 
            font-weight: 500;
            transition: all 0.3s;
            border: 1px solid rgba(248, 187, 217, 0.4);
        }
        .quick-btn:hover { 
            background: rgba(248, 187, 217, 0.4); 
            transform: translateY(-2px);
            box-shadow: 0 3px 10px rgba(248, 187, 217, 0.3);
        }
        
        .books-section { 
            margin-top: 40px; 
            display: none;
        }
        .books-header { text-align: center; margin-bottom: 30px; }
        .books-header h2 { 
            color: #374151; 
            font-size: 2rem; 
            margin-bottom: 10px; 
            font-weight: 600;
        }
        .books-header p { color: #6b7280; font-size: 1.1rem; }
        
        .books-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
            gap: 25px; 
        }
        
        .book-card { 
            background: rgba(255,255,255,0.95); 
            backdrop-filter: blur(10px);
            border-radius: 20px; 
            padding: 25px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
            transition: all 0.3s;
            border: 1px solid rgba(248, 187, 217, 0.2);
            position: relative;
            overflow: hidden;
        }
        .book-card:hover { 
            transform: translateY(-8px); 
            box-shadow: 0 25px 50px rgba(0,0,0,0.15); 
        }
        
        .book-genre-indicator {
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            border-radius: 0 20px 0 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }
        .genre-Fantasy { background: linear-gradient(135deg, #a855f7, #7c3aed); }
        .genre-Romance { background: linear-gradient(135deg, #f472b6, #ec4899); }
        .genre-Sci-Fi { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .genre-Thriller { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .genre-Horror { background: linear-gradient(135deg, #6b7280, #374151); }
        
        .book-card h3 { 
            color: #374151; 
            margin-bottom: 8px; 
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.3;
            padding-right: 60px;
        }
        .book-card .author { 
            color: #6b7280; 
            margin-bottom: 15px; 
            font-size: 0.95rem;
            font-style: italic;
        }
        .book-card .genre-badge { 
            display: inline-block; 
            padding: 6px 14px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600;
            margin-bottom: 15px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .book-card.genre-Fantasy .genre-badge { background: #f3e8ff; color: #7c3aed; }
        .book-card.genre-Romance .genre-badge { background: #fce7f3; color: #be185d; }
        .book-card.genre-Sci-Fi .genre-badge { background: #dbeafe; color: #1d4ed8; }
        .book-card.genre-Thriller .genre-badge { background: #fee2e2; color: #b91c1c; }
        .book-card.genre-Horror .genre-badge { background: #f3f4f6; color: #374151; }
        
        .book-card .description { 
            color: #4b5563; 
            line-height: 1.6; 
            margin-bottom: 15px; 
            font-size: 0.95rem;
        }
        .book-card .rating { 
            color: #f59e0b; 
            font-weight: 600;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            color: #6b7280;
            font-style: italic;
            font-size: 0.9rem;
        }
        .typing-dots {
            display: inline-flex;
            margin-left: 8px;
        }
        .typing-dots span {
            height: 6px;
            width: 6px;
            background: #9ca3af;
            border-radius: 50%;
            display: inline-block;
            margin: 0 2px;
            animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 30px 0;
            color: #6b7280;
            font-size: 0.9rem;
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .container { padding: 0 15px; }
            h1 { font-size: 2.5rem; }
            .books-grid { grid-template-columns: 1fr; }
            .quick-actions { justify-content: center; }
            .stats { gap: 15px; }
            .stat { min-width: 100px; padding: 12px 20px; }
            .chat-messages { height: 350px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo"></div>
            <h1>Readora</h1>
            <p class="tagline">Let your feelings guide your next read</p>
            
            <div class="stats">
                <div class="stat">
                    <span class="stat-number">50</span>
                    <span class="stat-label">Books</span>
                </div>
                <div class="stat">
                    <span class="stat-number">5</span>
                    <span class="stat-label">Genres</span>
                </div>
                <div class="stat">
                    <span class="stat-number">∞</span>
                    <span class="stat-label">Possibilities</span>
                </div>
            </div>
        </div>

        <div class="chat-container">
            <div class="chat-header">
                <h3>Chat with Readora Assistant</h3>
                <p>Powered by mood detection and personalized recommendations</p>
            </div>
            
            <div class="chat-messages" id="messages">
                <div class="message assistant">
                    <div class="message-content">
                        Hello! I'm Readora, your AI-powered book recommendation assistant. I understand how you're feeling and can suggest the perfect books to match your mood. Tell me how you're feeling today, or what genre interests you, and I'll find something amazing for you to read!
                    </div>
                </div>
            </div>

            <div class="quick-actions">
                <button class="quick-btn" onclick="sendQuickMessage('I am feeling sad today')">😢 Feeling Sad</button>
                <button class="quick-btn" onclick="sendQuickMessage('I am really happy and excited')">😊 Happy & Excited</button>
                <button class="quick-btn" onclick="sendQuickMessage('Recommend me some fantasy books')">⚔️ Fantasy Adventures</button>
                <button class="quick-btn" onclick="sendQuickMessage('I want some thriller books')">🔍 Thriller & Mystery</button>
                <button class="quick-btn" onclick="sendQuickMessage('Surprise me with book recommendations')">🎲 Surprise Me</button>
            </div>

            <div class="chat-input">
                <input type="text" id="messageInput" placeholder="Share your mood, ask for recommendations, or tell me about your reading preferences..." onkeypress="handleKeyPress(event)">
                <button id="sendBtn" onclick="sendMessage()">Send</button>
            </div>
        </div>

        <div class="books-section" id="booksSection">
            <div class="books-header">
                <h2>Recommended for You</h2>
                <p>Curated based on your mood and preferences</p>
            </div>
            <div class="books-grid" id="booksGrid"></div>
        </div>
        
        <div class="footer">
            <p>Readora uses AI-powered mood detection to recommend books that match your feelings.<br>
            Discover your next great read based on how you feel today.</p>
        </div>
    </div>

    <script>
        let isTyping = false;

        function addMessage(content, isUser = false) {
            const messages = document.getElementById('messages');
            const message = document.createElement('div');
            message.className = 'message ' + (isUser ? 'user' : 'assistant');
            message.innerHTML = '<div class="message-content">' + content + '</div>';
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;
        }

        function showBooks(books) {
            const section = document.getElementById('booksSection');
            const grid = document.getElementById('booksGrid');
            
            grid.innerHTML = '';
            
            books.forEach(book => {
                const genreClass = 'genre-' + book.genre.replace(/[^a-zA-Z]/g, '');
                const genreIcon = {
                    'Fantasy': '⚔️',
                    'Romance': '💕',
                    'Sci-Fi': '🚀',
                    'Thriller': '🔍',
                    'Horror': '👻'
                };
                
                const bookEl = document.createElement('div');
                bookEl.className = 'book-card ' + genreClass;
                bookEl.innerHTML = \`
                    <div class="book-genre-indicator \${genreClass}">\${genreIcon[book.genre] || '📖'}</div>
                    <h3>\${book.title}</h3>
                    <p class="author">by \${book.author}</p>
                    <span class="genre-badge">\${book.genre}</span>
                    <p class="description">\${book.description}</p>
                    <div class="rating">
                        <span>⭐</span>
                        <span>\${book.rating}/5</span>
                    </div>
                \`;
                grid.appendChild(bookEl);
            });
            
            section.style.display = 'block';
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }

        function showTyping() {
            if (isTyping) return;
            isTyping = true;
            const messages = document.getElementById('messages');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant typing-message';
            typingDiv.innerHTML = \`
                <div class="message-content typing-indicator">
                    Thinking<div class="typing-dots"><span></span><span></span><span></span></div>
                </div>
            \`;
            messages.appendChild(typingDiv);
            messages.scrollTop = messages.scrollHeight;
        }

        function removeTyping() {
            const typingMessage = document.querySelector('.typing-message');
            if (typingMessage) {
                typingMessage.remove();
            }
            isTyping = false;
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const sendBtn = document.getElementById('sendBtn');
            const message = input.value.trim();
            if (!message || isTyping) return;

            addMessage(message, true);
            input.value = '';
            sendBtn.disabled = true;
            showTyping();

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const data = await response.json();
                removeTyping();
                addMessage(data.response);
                
                if (data.books && data.books.length > 0) {
                    setTimeout(() => showBooks(data.books), 800);
                }
            } catch (error) {
                removeTyping();
                addMessage('Sorry, I encountered an error. Please try again in a moment.');
                console.error('Chat error:', error);
            } finally {
                sendBtn.disabled = false;
            }
        }

        function sendQuickMessage(message) {
            document.getElementById('messageInput').value = message;
            sendMessage();
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        // Initialize
        document.getElementById('messageInput').focus();
        
        // Add some personality with random welcome messages
        const welcomeMessages = [
            "What's your reading mood today?",
            "Ready to discover your next favorite book?",
            "How are you feeling? I'll find the perfect book for you!",
            "Tell me your reading preferences and I'll work my magic!"
        ];
        
        setTimeout(() => {
            const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
            addMessage(randomWelcome);
        }, 2000);
    </script>
</body>
</html>`);
});

// Start server
const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log('');
  console.log('🚀 Readora is running at http://localhost:3000');
  console.log('📚 Loaded ' + books.length + ' books across 5 genres');
  console.log('🤖 Watson-style AI processing active');
  console.log('🎨 Beautiful responsive UI with mood-based recommendations');
  console.log('');
  console.log('✨ Features:');
  console.log('   • Mood-based recommendations (sad→romance, happy→fantasy)');
  console.log('   • Genre-specific searches (fantasy, romance, sci-fi, thriller, horror)');
  console.log('   • Quick action buttons for common requests');
  console.log('   • Animated book cards with genre-specific styling');
  console.log('   • Professional responsive design');
  console.log('   • Watson Assistant integration ready');
  console.log('');
  console.log('💡 Usage:');
  console.log('   • "I am feeling sad" → Romance recommendations');
  console.log('   • "I am happy" → Fantasy adventures');
  console.log('   • "Recommend thriller books" → Thriller suggestions');
  console.log('   • "Surprise me" → Random mix of great books');
  console.log('');
  console.log('Ready to use! Open http://localhost:3000 in your browser');
});