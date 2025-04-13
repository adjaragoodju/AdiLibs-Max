import { useState, useRef } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useScrollToSection } from '../hooks/useScrollToSection';
import { FavoritesProvider } from '../context/FavoritesContext';

// Import layout components
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Import section components
import Hero from '../components/sections/Hero';
import SearchResults from '../components/sections/SearchResults';
import AboutUsSection from '../components/sections/AboutUsSection';
import FaqsSection from '../components/sections/FaqsSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import ReviewsSection from '../components/sections/ReviewsSection';

// Import book components
import PopularBooks from '../components/books/PopularBooks';
import GenresSection from '../components/books/GenresSection';
import BookModal from '../components/books/BookModal';
import FavoritesModal from '../components/books/FavoritesModal';

// Import author components
import AuthorQuote from '../components/authors/AuthorQuote';
import AuthorsSection from '../components/authors/AuthorsSection';

const Root = () => {
  // Use custom hooks
  const { books, uniqueGenres, uniqueAuthors, getBooksByFilter, searchBooks } =
    useBooks();
  const scrollToSection = useScrollToSection();

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);

  // Refs for scroll sections
  const homeRef = useRef(null);
  const genresRef = useRef(null);
  const authorsRef = useRef(null);
  const reviewsRef = useRef(null);
  const aboutRef = useRef(null);
  const faqsRef = useRef(null);
  const newsletterRef = useRef(null);

  // Handler for book click
  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  // Handler for search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const results = searchBooks(searchQuery);
    setSearchResults(results);
    setShowSearchResults(true);

    // Add scroll after setting results
    setTimeout(() => {
      window.scrollTo({
        top:
          document.querySelector('section').getBoundingClientRect().top +
          window.pageYOffset -
          100,
        behavior: 'smooth',
      });
    }, 100);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <FavoritesProvider>
      <Header
        uniqueGenres={uniqueGenres}
        uniqueAuthors={uniqueAuthors}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        scrollToSection={(ref) =>
          scrollToSection(ref, () => setMobileMenuOpen(false))
        }
        homeRef={homeRef}
        genresRef={genresRef}
        authorsRef={authorsRef}
        reviewsRef={reviewsRef}
        aboutRef={aboutRef}
        setShowFavoritesModal={setShowFavoritesModal}
        hoveredNavItem={hoveredNavItem}
        setHoveredNavItem={setHoveredNavItem}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedAuthor={selectedAuthor}
        setSelectedAuthor={setSelectedAuthor}
      />

      <main className='pt-24'>
        <Hero
          homeRef={homeRef}
          scrollToSection={scrollToSection}
          genresRef={genresRef}
        />

        {showSearchResults && (
          <SearchResults
            searchQuery={searchQuery}
            searchResults={searchResults}
            setShowSearchResults={setShowSearchResults}
            handleBookClick={handleBookClick}
          />
        )}

        <PopularBooks books={books} handleBookClick={handleBookClick} />

        <AuthorQuote />

        <GenresSection
          genresRef={genresRef}
          uniqueGenres={uniqueGenres}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          getBooksByFilter={getBooksByFilter}
          handleBookClick={handleBookClick}
        />

        <ReviewsSection
          reviewsRef={reviewsRef}
          customerReviews={[
            {
              name: 'Sarah Johnson',
              avatar: '/reviewers/sarah.jpg',
              rating: 5,
              text: 'AdiLibs has completely transformed my reading experience! The user-friendly interface makes it so easy to discover new books. I especially love how I can filter by genre and author.',
              date: 'March 15, 2025',
            },
            {
              name: 'Michael Chen',
              avatar: '/reviewers/michael.jpg',
              rating: 4,
              text: "Great selection of books across multiple genres. The author recommendations are spot on, and I've discovered several new favorites through this platform.",
              date: 'February 22, 2025',
            },
            {
              name: 'Elena Rodriguez',
              avatar: '/reviewers/elena.jpg',
              rating: 5,
              text: 'The curated collections are absolutely fantastic! I love how AdiLibs suggests books based on my previous readings. The favorites feature helps me keep track of what I want to read next.',
              date: 'March 28, 2025',
            },
            {
              name: 'David Thompson',
              avatar: '/reviewers/david.jpg',
              rating: 5,
              text: 'As an avid reader, I appreciate how easy AdiLibs makes it to find quality books. The interface is clean, navigation is intuitive, and the recommendations are spot-on.',
              date: 'March 5, 2025',
            },
          ]}
        />

        <AuthorsSection
          authorsRef={authorsRef}
          popularAuthors={[
            {
              name: 'J.K. Rowling',
              image: 'rowling.jpg',
              books: 7,
              genre: 'Fantasy',
              description:
                'British author best known for the Harry Potter series, which has won multiple awards and sold more than 500 million copies worldwide.',
            },
            {
              name: 'Stephen King',
              image: 'stephen-king.jpg',
              books: 61,
              genre: 'Horror',
              description:
                'American author of horror, supernatural fiction, suspense, and fantasy novels. His books have sold more than 350 million copies worldwide.',
            },
            {
              name: 'Agatha Christie',
              image: 'agatha-christie.jpg',
              books: 66,
              genre: 'Mystery',
              description:
                'English writer known for her detective novels, particularly those featuring Hercule Poirot and Miss Marple. Best-selling fiction author of all time.',
            },
            {
              name: 'George Orwell',
              image: 'george-orwell.jpg',
              books: 9,
              genre: 'Dystopian',
              description:
                'English novelist, essayist, journalist, and critic. His work is characterized by lucid prose, social criticism, opposition to totalitarianism, and support of democratic socialism.',
            },
          ]}
          getBooksByFilter={getBooksByFilter}
          handleBookClick={handleBookClick}
        />

        <AboutUsSection aboutRef={aboutRef} />

        <FaqsSection faqsRef={faqsRef} />

        <NewsletterSection newsletterRef={newsletterRef} />

        <Footer
          uniqueGenres={uniqueGenres}
          scrollToSection={scrollToSection}
          genresRef={genresRef}
          aboutRef={aboutRef}
          faqsRef={faqsRef}
          setSelectedGenre={setSelectedGenre}
        />
      </main>

      {selectedBook && (
        <BookModal
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
        />
      )}

      {showFavoritesModal && (
        <FavoritesModal
          setShowFavoritesModal={setShowFavoritesModal}
          setSelectedBook={setSelectedBook}
          scrollToSection={scrollToSection}
          genresRef={genresRef}
        />
      )}
    </FavoritesProvider>
  );
};

export default Root;
