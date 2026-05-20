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

export default function App() {
  const [books, setBooks] = useState([]);
  const [selectedMood, setSelectedMood] = useState('All');
  const [loading, setLoading] = useState(false);
  const [watsonStatus, setWatsonStatus] = useState('connecting'); // 'connecting', 'connected', 'error'
  const [error, setError] = useState(null);

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
  }, []);

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
        
        // Customize widget colors to match frontend terracotta theme
        instance.updateCSSVariables({
          '$interactive-01': '#FD7333', 
          '$interactive-02': '#E65A1B',
          '$focus': '#FD7333',
          '$text-01': '#150905',
          '$ui-01': '#FFFFFF',
          '$ui-02': '#FAF5F3'
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

  return (
    <div className="app-container">
      {/* Floating background orbs */}
      <div className="bg-orbs-container">
        <div className="bg-orb" style={{ width: '450px', height: '450px', top: '-10%', left: '-5%', background: 'rgba(253, 115, 51, 0.15)' }}></div>
        <div className="bg-orb" style={{ width: '380px', height: '380px', bottom: '-10%', right: '-5%', background: 'rgba(245, 158, 11, 0.12)', animationDelay: '-6s' }}></div>
        <div className="bg-orb" style={{ width: '300px', height: '300px', top: '40%', left: '50%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-12s' }}></div>
      </div>

      <div className="app-wrapper">
        {/* Navigation / Header */}
        <header className="app-header">
          <div className="logo-container">
            <div className="logo-text">Readora</div>
          </div>

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
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          {/* Subtle grid lines background overlay */}
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

              <div className="hero-stats animate-fade-in-up">
                <div className="stat-item">
                  <AnimatedCounter end={50} suffix="+" />
                  <span className="stat-label">Real Books</span>
                </div>
                <div className="stat-item" style={{ borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', padding: '0 40px' }}>
                  <AnimatedCounter end={5} />
                  <span className="stat-label">Core Genres</span>
                </div>
                <div className="stat-item">
                  <AnimatedCounter end={100} suffix="%" />
                  <span className="stat-label">IBM Cognitive</span>
                </div>
              </div>
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
            <button className={`mood-btn ${selectedMood === 'All' ? 'active' : ''}`} onClick={() => handleMoodClick('All')}>
              All Books
            </button>
            <button className={`mood-btn ${selectedMood === 'Fantasy' ? 'active' : ''}`} onClick={() => handleMoodClick('Fantasy')}>
              Fantasy & Adventure
            </button>
            <button className={`mood-btn ${selectedMood === 'Romance' ? 'active' : ''}`} onClick={() => handleMoodClick('Romance')}>
              Heartwarming Romance
            </button>
            <button className={`mood-btn ${selectedMood === 'Sci-Fi' ? 'active' : ''}`} onClick={() => handleMoodClick('Sci-Fi')}>
              Science Fiction
            </button>
            <button className={`mood-btn ${selectedMood === 'Thriller' ? 'active' : ''}`} onClick={() => handleMoodClick('Thriller')}>
              Mystery & Thriller
            </button>
            <button className={`mood-btn ${selectedMood === 'Horror' ? 'active' : ''}`} onClick={() => handleMoodClick('Horror')}>
              Spine-Chilling Horror
            </button>
          </div>
        </section>

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

          {!error && !loading && books.length === 0 && (
            <div className="empty-state">
              <p>No books matches found. Select a genre or ask Watson to suggest a category!</p>
            </div>
          )}

          {!error && !loading && books.length > 0 && (
            <>
              <div className="section-header" style={{ marginBottom: '20px' }}>
                <h2>Recommended {selectedMood !== 'All' ? selectedMood : ''} Books</h2>
                <p>Matching your search criteria and cognitive vibes</p>
              </div>
              <div className="books-grid">
                {books.map((book) => {
                  const genreClass = (book.genre || '').toLowerCase().replace(/[^a-zA-Z]/g, '');
                  return (
                    <div key={book.id} className={`book-card ${genreClass}`}>
                      {/* 3D Book Illustration */}
                      <div className="book-3d-container">
                        <div className="book-3d">
                          <div className="book-cover">
                            <span className="cover-genre">{book.genre}</span>
                            <h4 className="cover-title">{book.title}</h4>
                            <span className="cover-author">{book.author}</span>
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
                            Rating: {book.rating || '4.5'}/5
                          </span>
                          <button className="book-btn">Get Book</button>
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
    </div>
  );
}
