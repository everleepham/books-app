import type { Book } from "../types/Book"
import type { Author } from "../types/Authors"

interface BookSearchResultsProps {
	searchResults: Book[]
	authors: Author[]
	onSelectBook: (book: Book) => void
	onClearResults: () => void
}

const BookSearchResults = ({
	searchResults,
	authors,
	onSelectBook,
	onClearResults,
}: BookSearchResultsProps) => {
	const handleBookClick = (book: Book) => {
		onSelectBook(book)
		onClearResults()
	}

	if (searchResults.length === 0) return null

	return (
		<div className="border rounded-md shadow-sm mt-2 max-h-60 overflow-y-auto bg-white">
			{searchResults.map((book) => (
				<div
					key={book.id ?? book.isbn} // fallback if no id
					className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
					onClick={() => handleBookClick(book)}
				>
					<div className="flex gap-3">
						{book.coverUrl && (
							<img
								src={book.coverUrl}
								alt={book.title}
								className="w-12 h-16 object-cover rounded"
								onError={(e) => {
									e.currentTarget.style.display = "none"
								}}
							/>
						)}
						<div className="flex-1">
							<p className="font-medium text-sm text-gray-800">{book.title}</p>
							<p className="text-xs text-gray-600 mt-1">
								{authors.find((a) => a.id === book.authorId)?.name ?? "Unknown author"}
							</p>
							<div className="flex gap-2 mt-1">
								{book.publishedYear && (
									<span className="text-xs text-gray-500">{book.publishedYear}</span>
								)}
								{book.isbn ? (
									<span className="text-xs text-blue-600">ISBN: {book.isbn}</span>
								) : (
									<span className="text-xs text-red-500">No ISBN available</span>
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default BookSearchResults
