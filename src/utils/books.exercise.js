import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book)
}

function getBookSearchConfig(query, user) {
  return {
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: user.token,
      }).then(data => data.books),
    config: {
      onSuccess(books) {
        for (const book of books) {
          setQueryDataForBook(book)
        }
      },
    },
  }
}

function useBookSearch(query, user) {
  const result = useQuery(getBookSearchConfig(query, user))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId, user) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      client(`books/${bookId}`, {
        token: user.token,
      }).then(data => data.book),
  })
  return data ?? loadingBook
}

function refetchBookSearchQuery(user) {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(getBookSearchConfig('', user))
}

export {useBookSearch, useBook, refetchBookSearchQuery, setQueryDataForBook}
