import type { Book } from "../types/Book"

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"

const transformGoogleBook = (item: any): Book => {
	const volume = item.volumeInfo

	const isbn =
		volume.industryIdentifiers?.find(
			(id: any) => id.type === "ISBN_13" || id.type === "ISBN_10"
		)?.identifier || "N/A"

	return {
		id: 0, 
		title: volume.title || "Untitled",
		authorId: 0, 
		isbn,
		publishedYear: volume.publishedDate
			? parseInt(volume.publishedDate.slice(0, 4))
			: 0,
		description: volume.description || "No description available.",
		coverUrl: volume.imageLinks?.thumbnail || "",
		pages: volume.pageCount || 0,
	}
}

export const searchBooksByTitle = async (title: string): Promise<Book[]> => {
	try {
		const params = new URLSearchParams({
			q: `intitle:${title}`,
			country: "US",
			maxResults: "20",
		})

		const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`)

		if (!response.ok) {
			throw new Error(`API request failed with status ${response.status}`)
		}

		const data = await response.json()

		if (!data.items || data.items.length === 0) {
			return []
		}

		return data.items.map(transformGoogleBook)
	} catch (error) {
		console.error("Error fetching books from Google Books API:", error)
		return []
	}
}
