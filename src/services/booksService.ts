import type { Book } from '../types/Book';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5095';


export const booksService = {
    getAllBooks: async (): Promise<Book[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/books`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Book[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching books:", error);
            throw new Error("Failed to fetch books");
        }
    },

    getBookById: async (id: number): Promise<Book> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/books/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: Book = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching book with id ${id}:`, error);
            throw new Error("Failed to fetch book");
        }
    },

    createBook: async (book: Omit<Book, 'id'>): Promise<Book> => {
        try {
          // map camelCase -> PascalCase
          const bookToSend = {
            Title: book.title,
            ISBN: book.isbn,
            PublishedYear: book.publishedYear,
            Description: book.description,
            Pages: book.pages,
            AuthorId: book.authorId,
            CoverUrl: book.coverUrl,
          };

          console.log("Sending book:", bookToSend);

      
          const response = await fetch(`${API_BASE_URL}/api/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookToSend),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data: Book = await response.json();
          return data;
        } catch (error) {
          console.error("Error creating book:", error);
          throw new Error("Failed to create book");
        }
      }
    }

      
