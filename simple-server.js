const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Your book database
const books = [
  { id: 1, title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", description: "A young wizard's first year at Hogwarts", rating: 4.9 },
  { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", description: "A hobbit's epic quest to reclaim a lost kingdom", rating: 4.4 },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", description: "Love and misunderstandings in Regency England", rating: 4.9 },
  { id: 4, title: "The Notebook", author: "Nicholas Sparks", genre: "Romance", description: "A timeless love story spanning decades", rating: 4.5 },
  { id: 5, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", description: "Power politics and sandworms on a desert planet", rating: 4.9 },
  { id: 6, title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", description: "An astronaut survives alone on Mars", rating: 4.5 },
  { id: 7, title: "Gone Girl", author: "Gillian Flynn", genre: "Thriller", description: "A woman's disappearance hides sinister secrets", rating: 4.5 },
  { id: 8, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Thriller", description: "A journalist and hacker uncover dark secrets in Sweden", rating: 4.5 },
  { id: 9, title: "It", author: "Stephen King", genre: "Horror", description: "A shape-shifting clown haunts a group of friends", rating: 4.5 },
  { id: 10, title: "The Shining", author: "Stephen King", genre: "Horror", description: "A family trapped in a haunted hotel descends into madness", rating: 4.5 }
];

// Chat processing
function processMessage(message) {
  const text = message.toLowerCase();
  let response = "I'd love to help you find the perfect book!";
  let genre = null;

  if (text.includes('sad')) {
    response = "I understand you're feeling sad. Here are some heartwarming romance books that might lift your spirits:";
    genre = "Romance";
  } else if (text.includes('happy')) {
    response = "That's wonderful! Here are some exciting fantasy adventures to match your mood:";
    genre = "Fantasy";
  } else if (text.includes('fantasy')) {
    response = "Great choice! Fantasy books can transport you to magical worlds:";
    genre = "Fantasy";
  } else if (text.includes('romance')) {
    response = "Romance is wonderful! Here are some heartwarming love stories:";
    genre = "Romance";
  } else if (text.includes('thriller')) {
    response = "Thrillers are perfect for keeping you on edge! Here are some gripping reads:";
    genre = "Thriller";
  } else if (text.includes('sci-fi') || text.includes('science fiction')) {
    response = "Science fiction opens endless possibilities! Here are some mind-bending books:";
    genre = "Sci-Fi";
  } else if (text.includes('horror')) {
    response = "Looking for spine-chilling reads? Here are some horror recommendations:";
    genre = "Horror";
  }

  return { response, genre };
}

// API endpoint
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const result = processMessage(message);
  
  let recommendedBooks = [];
  if (result.genre) {
    recommendedBooks = books
      .filter(book => book.genre === result.genre)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
  } else {
    recommendedBooks = books.sort(() => Math.random() - 0.5).slice(0, 2);
  }

  res.json({
    response: result.response,
    books: recommendedBooks,
    context: { genre: result.genre }
  });
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Readora - Book Recommendations</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fdf2f8 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #f472b6, #a855f7); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .logo::before { content: "📚"; font-size: 40px; }
        h1 { font-size: 3rem; color: #374151; margin-bottom: 10px; }
        .tagline { font-size: 1.2rem; color: #6b7280; margin-bottom: 30px; }
        .chat-container { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 30px; }
        .chat-header { background: linear-gradient(135deg, #f472b6, #a855f7); color: white; padding: 20px; text-align: center; }
        .chat-messages { height: 400px; overflow-y: auto; padding: 20px; }
        .message { margin-bottom: 15px; display: flex; align-items: flex-start; }
        .message.user { justify-content: flex-end; }
        .message-content { max-width: 70%; padding: 12px 16px; border-radius: 18px; }
        .message.user .message-content { background: linear-gradient(135deg, #f472b6, #a855f7); color: white; }
        .message.assistant .message-content { background: #f3f4f6; color: #374151; }
        .chat-input { display: flex; padding: 20px; border-top: 1px solid #e5e7eb; }
        .chat-input input { flex: 1; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 20px; outline: none; }
        .chat-input input:focus { border-color: #f472b6; }
        .chat-input button { margin-left: 10px; background: linear-gradient(135deg, #f472b6, #a855f7); color: white; border: none; padding: 12px 20px; border-radius: 20px; cursor: pointer; }
        .quick-actions { display: flex; gap: 10px; padding: 0 20px 20px; flex-wrap: wrap; }
        .quick-btn { background: #fef3c7; color: #92400e; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 14px; }
        .quick-btn:hover { background: #fde68a; }
        .books-container { display: grid; gap: 20px; }
        .book { background: white; border-radius: 15px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .book h3 { color: #374151; margin-bottom: 5px; }
        .book .author { color: #6b7280; margin-bottom: 10px; }
        .book .genre { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-bottom: 10px; }
        .book .description { color: #4b5563; line-height: 1.5; margin-bottom: 10px; }
        .book .rating { color: #f59e0b; }
        .typing { display: none; color: #6b7280; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo"></div>
            <h1>Readora</h1>
            <p class="tagline">Let your feelings guide your next read</p>
        </div>

        <div class="chat-container">
            <div class="chat-header">
                <h3>Chat with Readora Assistant</h3>
                <p>Tell me how you're feeling or what genre you'd like!</p>
            </div>
            
            <div class="chat-messages" id="messages">
                <div class="message assistant">
                    <div class="message-content">
                        Hello! I'm your personal book recommendation assistant. How are you feeling today? I can suggest books based on your mood or favorite genres.
                    </div>
                </div>
            </div>

            <div class="quick-actions">
                <button class="quick-btn" onclick="sendQuickMessage('I am sad')">😢 Sad</button>
                <button class="quick-btn" onclick="sendQuickMessage('I am happy')">😊 Happy</button>
                <button class="quick-btn" onclick="sendQuickMessage('Recommend fantasy')">⚔️ Fantasy</button>
                <button class="quick-btn" onclick="sendQuickMessage('I want thriller')">🔍 Thriller</button>
            </div>

            <div class="chat-input">
                <input type="text" id="messageInput" placeholder="Share your mood or ask for book recommendations..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>

        <div class="books-container" id="books"></div>
    </div>

    <script>
        function addMessage(content, isUser = false) {
            const messages = document.getElementById('messages');
            const message = document.createElement('div');
            message.className = 'message ' + (isUser ? 'user' : 'assistant');
            message.innerHTML = '<div class="message-content">' + content + '</div>';
            messages.appendChild(message);
            messages.scrollTop = messages.scrollHeight;
        }

        function showBooks(books) {
            const container = document.getElementById('books');
            container.innerHTML = '';
            
            books.forEach(book => {
                const bookEl = document.createElement('div');
                bookEl.className = 'book';
                bookEl.innerHTML = \`
                    <h3>\${book.title}</h3>
                    <p class="author">by \${book.author}</p>
                    <span class="genre">\${book.genre}</span>
                    <p class="description">\${book.description}</p>
                    <p class="rating">⭐ \${book.rating}/5</p>
                \`;
                container.appendChild(bookEl);
            });
        }

        function showTyping() {
            addMessage('Typing...', false);
        }

        function removeTyping() {
            const messages = document.getElementById('messages');
            const lastMessage = messages.lastElementChild;
            if (lastMessage && lastMessage.textContent.includes('Typing...')) {
                messages.removeChild(lastMessage);
            }
        }

        async function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, true);
            input.value = '';
            showTyping();

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                
                const data = await response.json();
                removeTyping();
                addMessage(data.response);
                
                if (data.books && data.books.length > 0) {
                    showBooks(data.books);
                }
            } catch (error) {
                removeTyping();
                addMessage('Sorry, something went wrong. Please try again.');
            }
        }

        function sendQuickMessage(message) {
            document.getElementById('messageInput').value = message;
            sendMessage();
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }
    </script>
</body>
</html>
  `);
});

const PORT = 3000;
app.listen(PORT, 'localhost', () => {
  console.log('🚀 Readora is running at http://localhost:3000');
  console.log('📚 Ready with ' + books.length + ' books');
  console.log('💬 Chat functionality enabled');
});