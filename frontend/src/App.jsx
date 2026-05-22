import { useState, useEffect, useRef } from 'react';

// Typewriter Component
function TypewriterText({ text, speed = 50, delay = 0, className = '' }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(timer);
          setIsComplete(true);
        }
      }, speed);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {!isComplete && <span className="typewriter-cursor"></span>}
    </span>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <span ref={ref} className="stat-val">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Open Library Cover Art Helper via Backend Proxy
const fetchCoverUrl = async (title, author) => {
  try {
    const query = `title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`;
    const res = await fetch(`/api/cover?${query}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.coverUrl;
  } catch (err) {
    console.error('Error fetching cover from proxy:', err);
  }
  return null;
};

// Vibe Mapping Details
const vibeDetails = {
  All: {
    name: "Harmonious Vibe",
    desc: "A balanced selection of literary genres suited for any state of mind. Start chatting with Watson on the bottom right to tailor your recommendations.",
    glowClass: "vibe-glow-all"
  },
  Fantasy: {
    name: "Mystical Wonder & Adventure",
    desc: "Watson senses a desire for escape, magical lore, and extraordinary journeys. Exploring worlds beyond imagination.",
    glowClass: "vibe-glow-fantasy"
  },
  Romance: {
    name: "Cozy & Heartwarming Romance",
    desc: "Watson senses a yearning for connection, emotional depth, and tender moments. Exploring relationships and heartwarming bonds.",
    glowClass: "vibe-glow-romance"
  },
  'Sci-Fi': {
    name: "Cosmic Exploration",
    desc: "Watson senses an intellectual curiosity about technology, space-time, and speculative futures. Probing the boundaries of what is possible.",
    glowClass: "vibe-glow-scifi"
  },
  Thriller: {
    name: "High-Suspense Thrills",
    desc: "Watson senses a craving for mystery, tension, and mind-bending plot twists. Walking the line between shadows and revelation.",
    glowClass: "vibe-glow-thriller"
  },
  Horror: {
    name: "Spine-Chilling Tension",
    desc: "Watson senses a brave curiosity for the dark, psychological shadows, and supernatural dread. Enter if you dare.",
    glowClass: "vibe-glow-horror"
  }
};

export default function App() {
  const [books, setBooks] = useState([]);
  const [selectedMood, setSelectedMood] = useState('All');
  const [loading, setLoading] = useState(false);
  const [watsonStatus, setWatsonStatus] = useState('connecting'); // 'connecting', 'connected', 'error'
  const [error, setError] = useState(null);

  // Upgraded Feature States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none'); // 'none', 'rating', 'alphabetical'
  const [shelfOpen, setShelfOpen] = useState(false);

  // Saved Books Shelf (backed by localStorage)
  const [savedShelf, setSavedShelf] = useState(() => {
    try {
      const saved = localStorage.getItem('readora_shelf');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Book Covers Cache (backed by localStorage)
  const [bookCovers, setBookCovers] = useState(() => {
    try {
      const saved = localStorage.getItem('readora_covers_cache');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save shelf to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('readora_shelf', JSON.stringify(savedShelf));
    } catch (e) {
      console.error('Failed to save shelf to localStorage', e);
    }
  }, [savedShelf]);

  // Save covers cache to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('readora_covers_cache', JSON.stringify(bookCovers));
    } catch (e) {
      console.error('Failed to save covers cache to localStorage', e);
    }
  }, [bookCovers]);

  // Load books from Express backend
  const fetchBooks = async (genre = '') => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/books';
      if (genre && genre !== 'All') {
        url += `?genre=${encodeURIComponent(genre)}`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to retrieve book recommendations');
      }
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not connect to the backend server. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBooks();
    // Clean up old 'placeholder', invalid, or openlibrary.org cache values so they can be re-fetched via the iTunes backend proxy
    try {
      const cached = localStorage.getItem('readora_covers_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        let changed = false;
        Object.keys(parsed).forEach(key => {
          const val = parsed[key];
          if (
            val === 'placeholder' || 
            val === null || 
            val === 'none' || 
            (typeof val === 'string' && val.includes('openlibrary.org'))
          ) {
            delete parsed[key];
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('readora_covers_cache', JSON.stringify(parsed));
        }
        setBookCovers(parsed);
      }
    } catch (e) {
      console.error('Failed to clean cover cache on startup:', e);
    }
  }, []);

  // Asynchronously fetch missing book covers sequentially with a delay to prevent API rate limits
  useEffect(() => {
    let active = true;

    const loadCovers = async () => {
      // Loop sequentially through each book to avoid spamming the Open Library API concurrently
      for (const book of books) {
        if (!active) break;
        const key = `${book.title}-${book.author}`;
        
        if (!bookCovers[key]) {
          const url = await fetchCoverUrl(book.title, book.author);
          if (!active) break;
          
          setBookCovers(prev => {
            const updated = { ...prev, [key]: url || 'placeholder' };
            // Persist immediately in localStorage
            try {
              localStorage.setItem('readora_covers_cache', JSON.stringify(updated));
            } catch (e) {
              console.error(e);
            }
            return updated;
          });
          
          // Wait 250ms before the next request to respect Open Library API rate limits
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      }
    };

    if (books.length > 0) {
      loadCovers();
    }

    return () => {
      active = false;
    };
  }, [books]);

  // Listen to Watson Assistant message stream
  const handleWatsonMessage = (event) => {
    const output = event.data?.output;
    if (!output) return;

    let detectedGenre = null;

    // Scan for custom entity extraction (genre entity)
    if (output.entities && output.entities.length > 0) {
      const genreEntity = output.entities.find(e => e.entity === 'genre');
      if (genreEntity) {
        detectedGenre = genreEntity.value;
      }
    }

    // Fallback text scanning of Watson's responses to dynamically match book genres
    if (!detectedGenre && output.generic && output.generic.length > 0) {
      const textResponse = output.generic.find(g => g.response_type === 'text');
      if (textResponse && textResponse.text) {
        const text = textResponse.text.toLowerCase();
        if (text.includes('fantasy') || text.includes('hogwarts') || text.includes('magic') || text.includes('wizard')) {
          detectedGenre = 'Fantasy';
        } else if (text.includes('romance') || text.includes('love') || text.includes('notebook')) {
          detectedGenre = 'Romance';
        } else if (text.includes('sci-fi') || text.includes('science fiction') || text.includes('dune') || text.includes('space')) {
          detectedGenre = 'Sci-Fi';
        } else if (text.includes('thriller') || text.includes('mystery') || text.includes('silent patient') || text.includes('gone girl')) {
          detectedGenre = 'Thriller';
        } else if (text.includes('horror') || text.includes('scary') || text.includes('shining') || text.includes('spooky')) {
          detectedGenre = 'Horror';
        }
      }
    }

    if (detectedGenre) {
      console.log(`Watson recommended genre: ${detectedGenre}`);
      setSelectedMood(detectedGenre);
      fetchBooks(detectedGenre);

      // Smooth scroll to recommendations
      setTimeout(() => {
        const section = document.getElementById('recommendations');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  // Load the IBM Watson Assistant Web Chat widget
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: "b41fbb14-62ff-4ac9-b2b9-4b7df57e7344", 
      region: "au-syd", 
      serviceInstanceID: "7927b76c-9f7b-479c-a340-17d48e0c3ce7", 
      carbonTheme: "g10", // Light Gray Carbon Theme to match light mode
      onLoad: async (instance) => {
        setWatsonStatus('connected');
        console.log("IBM Watson Assistant Web Chat loaded successfully.");
        
        // Customize widget colors to match light cozy warm library theme
        instance.updateCSSVariables({
          '$interactive-01': '#D96B43', 
          '$interactive-02': '#B5522B',
          '$focus': '#D96B43',
          '$text-01': '#362C28',
          '$ui-01': '#FFFFFF',
          '$ui-02': '#FAF6EE'
        });

        instance.on({ type: "receive", handler: handleWatsonMessage });
        await instance.render();
      }
    };

    const script = document.createElement('script');
    script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
    script.async = true;
    script.onerror = () => {
      setWatsonStatus('error');
      console.error("Error loading Watson Assistant script.");
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const handleMoodClick = (genre) => {
    setSelectedMood(genre);
    fetchBooks(genre);
  };

  // Shelf Drawer Operations
  const addToShelf = (book) => {
    if (!savedShelf.some(item => item.book.id === book.id)) {
      setSavedShelf([...savedShelf, {
        book,
        status: 'want-to-read',
        notes: '',
        addedAt: new Date().toISOString()
      }]);
    }
    setShelfOpen(true);
  };

  const removeFromShelf = (bookId) => {
    setSavedShelf(savedShelf.filter(item => item.book.id !== bookId));
  };

  const updateShelfStatus = (bookId, newStatus) => {
    setSavedShelf(savedShelf.map(item => 
      item.book.id === bookId ? { ...item, status: newStatus } : item
    ));
  };

  const updateShelfNotes = (bookId, newNotes) => {
    setSavedShelf(savedShelf.map(item => 
      item.book.id === bookId ? { ...item, notes: newNotes } : item
    ));
  };

  // Client-Side Search & Sort Filtering
  const filteredBooks = books
    .filter((book) => {
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.description.toLowerCase().includes(q) ||
        book.genre.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      return 0; // Default
    });

  return (
    <div className="app-container">
      {/* Floating background orbs */}
      <div className="bg-orbs-container">
        <div className="bg-orb" style={{ width: '450px', height: '450px', top: '-10%', left: '-5%', background: 'rgba(217, 107, 67, 0.08)' }}></div>
        <div className="bg-orb" style={{ width: '380px', height: '380px', bottom: '-10%', right: '-5%', background: 'rgba(224, 159, 103, 0.06)', animationDelay: '-6s' }}></div>
        <div className="bg-orb" style={{ width: '300px', height: '300px', top: '40%', left: '50%', background: 'rgba(217, 107, 67, 0.04)', animationDelay: '-12s' }}></div>
      </div>

      <div className="app-wrapper">
        {/* Navigation / Header */}
        <header className="app-header">
          <div className="logo-container">
            <div className="logo-text">Readora</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="shelf-toggle-btn" onClick={() => setShelfOpen(true)}>
              <span>My Bookshelf</span>
              <span className="shelf-count-badge">{savedShelf.length}</span>
            </button>

            <div className="status-badge">
              <div className={`status-dot ${watsonStatus === 'connecting' ? 'connecting' : ''}`} 
                   style={{ backgroundColor: watsonStatus === 'connected' ? '#10b981' : watsonStatus === 'error' ? '#ef4444' : '#f59e0b' }}>
              </div>
              <span>
                {watsonStatus === 'connected' && 'Watson Assistant Active'}
                {watsonStatus === 'connecting' && 'Connecting to Watson...'}
                {watsonStatus === 'error' && 'Watson Offline'}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg">
            <div className="hero-grid-lines"></div>
          </div>

          <div className="hero-container">
            {/* Left Column: Title & stats */}
            <div className="hero-text-col">
              <div className="hero-badge animate-fade-in-up">
                IBM Watson WatsonX Powered Chatbot Project
              </div>
              <h1 className="hero-title animate-fade-in-up">
                <TypewriterText text="Let Your Feelings" speed={50} delay={200} /><br />
                <span className="hero-gradient">
                  <TypewriterText text="Guide Your Next Read" speed={50} delay={1100} />
                </span>
              </h1>
              <p className="hero-desc animate-fade-in-up">
                <TypewriterText 
                  text="An advanced full-stack book recommendation system that uses IBM Watson's cognitive mood analysis to find books that match your state of mind."
                  speed={15} 
                  delay={2200} 
                />
              </p>
            </div>

            {/* Right Column: Cozy Library Hero Image */}
            <div className="hero-image-col">
              <div className="hero-3d-wrapper">
                <img 
                  src="/cozy_library.png" 
                  alt="Cozy Library" 
                  className="hero-illustration" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* How it works steps */}
        <section className="steps-section">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Your mood-guided journey in three steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">01</div>
              <h3>Talk to Watson</h3>
              <p>Click the chat widget on the bottom right and express how you feel or what you want to read.</p>
            </div>
            <div className="step-card">
              <div className="step-num">02</div>
              <h3>Cognitive Analysis</h3>
              <p>Watson analyzes your sentiments, mood markers, and keywords to identify the ideal genre.</p>
            </div>
            <div className="step-card">
              <div className="step-num">03</div>
              <h3>Get Matched</h3>
              <p>The system dynamically synchronizes recommendations and pulls matching books from the database.</p>
            </div>
          </div>
        </section>

        {/* Dashboard Filter panel */}
        <section className="dashboard-filter-section">
          <div className="filter-badge">Interactive Dashboard</div>
          <h2 className="mood-title">Explore by Vibe</h2>
          <p className="mood-desc">Select a specific reading category or trigger Watson's recommendation list directly</p>
          
          <div className="mood-btn-container">
            <button className={`mood-btn all ${selectedMood === 'All' ? 'active' : ''}`} onClick={() => handleMoodClick('All')}>
              All Books
            </button>
            <button className={`mood-btn fantasy ${selectedMood === 'Fantasy' ? 'active' : ''}`} onClick={() => handleMoodClick('Fantasy')}>
              Fantasy & Adventure
            </button>
            <button className={`mood-btn romance ${selectedMood === 'Romance' ? 'active' : ''}`} onClick={() => handleMoodClick('Romance')}>
              Heartwarming Romance
            </button>
            <button className={`mood-btn sci-fi ${selectedMood === 'Sci-Fi' ? 'active' : ''}`} onClick={() => handleMoodClick('Sci-Fi')}>
              Science Fiction
            </button>
            <button className={`mood-btn thriller ${selectedMood === 'Thriller' ? 'active' : ''}`} onClick={() => handleMoodClick('Thriller')}>
              Mystery & Thriller
            </button>
            <button className={`mood-btn horror ${selectedMood === 'Horror' ? 'active' : ''}`} onClick={() => handleMoodClick('Horror')}>
              Spine-Chilling Horror
            </button>
          </div>
        </section>

        {/* Watson Vibe Indicator Ring */}
        {(() => {
          const currentVibe = vibeDetails[selectedMood] || vibeDetails.All;
          return (
            <div className={`vibe-dashboard-container ${currentVibe.glowClass}`}>
              <div className="vibe-ring-col">
                <div className="vibe-ring-outer">
                  <div className="vibe-ring-dashed-inner"></div>
                  <div className="vibe-ring-inner">
                    <div className="vibe-ring-dot"></div>
                  </div>
                </div>
              </div>
              <div className="vibe-info-col">
                <span className="vibe-status-label">Active Watson Vibe</span>
                <h3 className="vibe-active-name">{currentVibe.name}</h3>
                <p className="vibe-description">{currentVibe.desc}</p>
              </div>
            </div>
          );
        })()}

        {/* Dashboard Search & Sort Controls */}
        <div className="dashboard-controls-wrapper">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, author, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sort-container">
            <span className="sort-label">Sort:</span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="none">Database Order</option>
              <option value="rating">Rating (Highest First)</option>
              <option value="alphabetical">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Recommendations Section */}
        <section className="recommendations-section" id="recommendations">
          {error && (
            <div className="empty-state" style={{ borderColor: '#ef4444', color: '#f87171' }}>
              <p>{error}</p>
              <button className="mood-btn" style={{ margin: '15px auto 0' }} onClick={() => fetchBooks(selectedMood)}>
                Retry Connection
              </button>
            </div>
          )}

          {!error && loading && (
            <div className="empty-state">
              <p>Querying the database for matches...</p>
            </div>
          )}

          {!error && !loading && filteredBooks.length === 0 && (
            <div className="empty-state">
              <p>No book matches found. Try clearing your search filters or ask Watson to suggest a category!</p>
            </div>
          )}

          {!error && !loading && filteredBooks.length > 0 && (
            <>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2>Recommended {selectedMood !== 'All' ? selectedMood : ''} Books</h2>
                <p>Matching your search criteria and cognitive vibes</p>
              </div>
              <div className="books-grid">
                {filteredBooks.map((book) => {
                  const genreClass = (book.genre || '').toLowerCase().replace(/[^a-zA-Z]/g, '');
                  const coverUrl = bookCovers[`${book.title}-${book.author}`];
                  const hasCover = coverUrl && coverUrl !== 'placeholder';
                  const isSaved = savedShelf.some(item => item.book.id === book.id);
                  
                  return (
                    <div key={book.id} className={`book-card ${genreClass}`}>
                      {/* 3D Book Illustration */}
                      <div className="book-3d-container">
                        <div className="book-3d">
                          <div 
                            className="book-cover"
                            style={{ 
                              backgroundImage: hasCover ? `url(${coverUrl})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              backgroundRepeat: 'no-repeat'
                            }}
                          >
                            {!hasCover && (
                              <>
                                <span className="cover-genre">{book.genre}</span>
                                <h4 className="cover-title">{book.title}</h4>
                                <span className="cover-author">{book.author}</span>
                              </>
                            )}
                          </div>
                          <div className="book-spine"></div>
                        </div>
                      </div>

                      {/* Book details column */}
                      <div className="book-details">
                        <div>
                          <span className="genre-badge">{book.genre}</span>
                          <h3 className="book-title-heading">{book.title}</h3>
                          <div className="book-author-text">by {book.author}</div>
                          <p className="book-desc-text">{book.description}</p>
                        </div>

                        <div className="book-meta">
                          <span className="book-rating">
                            <span className="stars">
                              {'★'.repeat(Math.round(parseFloat(book.rating) || 4.5)) + '☆'.repeat(5 - Math.round(parseFloat(book.rating) || 4.5))}
                            </span>
                            <span className="rating-num">({book.rating || '4.5'})</span>
                          </span>
                          <button className={`book-btn ${isSaved ? 'saved' : ''}`} onClick={() => addToShelf(book)}>
                            {isSaved ? 'In Bookshelf' : 'Add to Shelf'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* CTA section banner */}
        <section className="cta-section">
          <div className="cta-card">
            <h2 className="cta-title">Not Sure How You Feel?</h2>
            <p className="cta-desc">Open the IBM Watson Assistant chat widget on the bottom right and type how your day is going. We'll do the rest!</p>
            <button className="cta-btn" onClick={() => {
              if (window.watsonAssistantChatInstance) {
                window.watsonAssistantChatInstance.open();
              } else {
                alert("Watson Chat Widget is loaded. Look for the bubble in the bottom right corner!");
              }
            }}>
              Start Conversing
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Readora Book Recommendation System. Powered by IBM Watson Assistant.</p>
          <p style={{ marginTop: '5px', opacity: 0.5 }}>Internship Project Refactored for Web Presentation.</p>
        </footer>
      </div>

      {/* Sliding Shelf Drawer Overlay */}
      <div 
        className={`shelf-overlay ${shelfOpen ? 'open' : ''}`}
        onClick={() => setShelfOpen(false)}
      ></div>

      {/* Sliding Shelf Drawer */}
      <div className={`shelf-drawer ${shelfOpen ? 'open' : ''}`}>
        <div className="shelf-header">
          <h2>My Bookshelf</h2>
          <button className="shelf-close-btn" onClick={() => setShelfOpen(false)}>×</button>
        </div>
        <div className="shelf-content">
          {savedShelf.length === 0 ? (
            <p className="shelf-empty">Your reading shelf is currently empty. Explore recommendations and add books to save your favorites!</p>
          ) : (
            savedShelf.map((item) => (
              <div key={item.book.id} className="shelf-item">
                <div className="shelf-item-header">
                  <div>
                    <div className="shelf-item-title">{item.book.title}</div>
                    <div className="shelf-item-author">by {item.book.author}</div>
                  </div>
                  <button 
                    className="shelf-item-remove"
                    onClick={() => removeFromShelf(item.book.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="shelf-item-controls">
                  <span className="cover-genre" style={{ color: 'var(--text-secondary)' }}>Status:</span>
                  <select
                    className="shelf-status-select"
                    value={item.status}
                    onChange={(e) => updateShelfStatus(item.book.id, e.target.value)}
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Currently Reading</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <textarea
                  className="shelf-notes-area"
                  placeholder="Add personal thoughts or book notes..."
                  value={item.notes}
                  onChange={(e) => updateShelfNotes(item.book.id, e.target.value)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
