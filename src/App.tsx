import { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import BookCard from "./components/BookCard";
import AuthorCard from "./components/AuthorCard";
import SearchBar from "./components/SearchBar";
import AddAuthorForm from "./components/tabs/AddAuthorForm";
import AddBookForm from "./components/tabs/AddBookForm";
import NavigationTabs from "./components/NavogationTabs";
import type { Author } from "./types/Authors";
import type { Book } from "./types/Book";
import { authorsService } from "./services/authorsService";
import { booksService } from "./services/booksService";

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState("books");
  const [searchTerm, setSearchTerm] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsData, booksData] = await Promise.all([
          authorsService.getAllAuthors(),
          booksService.getAllBooks(),
        ]);
        setAuthors(authorsData);
        setBooks(booksData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleAddAuthor = async (author: Omit<Author, "id">) => {
    try {
      const created = await authorsService.createAuthor(author);
      setAuthors((prev) => [...prev, created]);
      alert(`Author "${created.name}" added successfully!`);
      setActiveTab("authors");
    } catch (err) {
      console.error(err);
      alert("Failed to create author");
    }
  };

  const handleAddBook = async (book: Omit<Book, "id">) => {
    try {
      const created = await booksService.createBook(book);
      setBooks((prev) => [...prev, created]);
      alert(`Book "${created.title}" added successfully!`);
      setActiveTab("books");
    } catch (err) {
      console.error(err);
      alert("Failed to create book");
    }
  };

  const getAuthorById = (authorId: number) => {
    return authors.find((author) => author.id === authorId);
  };

  const getBookCountByAuthor = (authorId: number) => {
    return books.filter((book) => book.authorId === authorId).length;
  };

  const filteredBooks = books.filter((book) => {
    const author = getAuthorById(book.authorId);
    return (
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Books & Authors Library</h1>
          </div>
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </header>

      {/* Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        booksCount={filteredBooks.length}
        authorsCount={filteredAuthors.length}
      />

      {/* Main Content */}
    <main className="container mx-auto px-4 py-8">
        {activeTab === "books" && (
        <div className="space-y-4 flex flex-col flex-wrap">
            {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => {
                const author = getAuthorById(book.authorId);
                if (!author) return null; 
                return (
        <BookCard
          key={book.id} 
          book={book}
          author={getAuthorById(book.authorId)!} 
        />
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500">
                No books found matching your search.
              </div>
            )}
          </div>
        )}

        {activeTab === "authors" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author, index) => (
                <AuthorCard
                  key={author.id ?? `author-${index}`} 
                  author={author}
                  bookCount={getBookCountByAuthor(author.id ?? -1)}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-500">
                No authors found matching your search.
              </div>
            )}
          </div>
        )}

        {activeTab === "add-author" && (
          <AddAuthorForm
            onSubmit={handleAddAuthor}
            onCancel={() => setActiveTab("authors")}
          />
        )}

        {activeTab === "add-book" && (
          <AddBookForm authors={authors} onSubmit={handleAddBook} />
        )}
      </main>
    </div>
  );
};

export default App;
