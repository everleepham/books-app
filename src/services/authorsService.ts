import type { Author } from '../types/Authors';


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5095';


export const authorsService = {
    getAllAuthors: async (): Promise<Author[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/authors`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Author[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching authors:", error);
            throw new Error("Failed to fetch authors");
        }
    },

    getAuthorById: async (id: number): Promise<Author> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/authors/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Author = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching author with id ${id}:`, error);
            throw new Error("Failed to fetch author");
        }
    },

    createAuthor: async (author: Omit<Author, 'id'>): Promise<Author> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/authors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(author),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: Author = await response.json();
            return data;
        } catch (error) {
            console.error("Error creating author:", error);
            throw new Error("Failed to create author");
        }
    },
};
