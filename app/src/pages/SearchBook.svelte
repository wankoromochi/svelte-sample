<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'

  import type { BookItem, Result } from '../repositories/book';
  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory'
  const BookRepository = RepositoryFactory[BOOK]

  /** 検索値の初期値 */
  let q = ''
  /** 取得した配列 */
  let books: BookItem[] = []
  let promise: Promise<void>

  /** 検索ボタン押下時の処理 */
  const handleSubmit = () => {
    if (!q.trim()) return
    promise = getBooks()
  }

  /** 本一覧取得 */
  const getBooks = async () => {
    books = []
    const result = await BookRepository.get({ q })
    books = result.items
  }
</script>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <SearchBar bind:value={q} />
  </form>
 
  <div class="text-center mt-4">

    {#each books as book (book.id)}
      <div>{book.volumeInfo.title}</div>
    {:else}
      <div>検索結果が見つかりませんでした。</div>
    {/each}

    {#await promise}
      <div>loading...</div>
      {:catch e}
        <span class="text-red-600 text-sm">
          {e.message}
        </span>
    {/await}
  </div>
</div>

