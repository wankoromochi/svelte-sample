import SearchBook from '../pages/SearchBook.svelte'
import DetailBook from '../pages/DetailBook.svelte'

export const routes = {
  '/': SearchBook,
  '/books/:id': DetailBook
}
