<script lang="ts">
  import { books } from '../store/book';

  import SearchBar from '../components/SearchBar.svelte'
  import Spinner from '../components/Spinner.svelte';
  import BookCard from '../components/BookCard.svelte';

  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory'

  import InfiniteScroll from "svelte-infinite-scroll"

  /** api */
  const BookRepository = RepositoryFactory[BOOK]
  /** 検索値の初期値 */
  let q = ''
  /** 取得した配列 */
  // let books: BookItem[] = []
  let promise: Promise<void>
  /** 取得開始ページ */
  let startIndex = 0;
  /** データの件数 */
  let totalItems = 0

  /** ページ表示時にstoreリセット */
  books.reset()

  /** 検索ボタン押下時の処理 */
  const handleSubmit = () => {
    if (!q.trim()) return
    promise = getBooks()
  }

  /** 本一覧取得 */
  const getBooks = async () => {
    // 配列をリセット
    books.reset()
    // apiをコールし、データを取得
    const result = await BookRepository.get({ q })
    // レスポンスデータをローカル配列に格納
    books.add(result.items)
    // レスポンスデータの件数を格納
    totalItems = result.totalItems
  }

  /** ページ数のカウント(watch) */
  $: hasMore = totalItems > $books.length

  /** もっと見るの挙動 */
  const handleLoadMore = () => {
    startIndex += 10;
    promise = getNextPage();
  }

  /** 次のページへ進む */
  const getNextPage = async () => {
    const result = await BookRepository.get({ q, startIndex });
  
    // 取得データが既に存在するものを含む可能性があるので、idでフィルタリングしてます。
    const bookIds = $books.map((book) => book.id);
    const filteredItems = result.items.filter((item) => {
      return !bookIds.includes(item.id);
    });
    books.add(filteredItems)
  };
</script>

<div>
  <form on:submit|preventDefault={handleSubmit}>
    <SearchBar bind:value={q} />
  </form>
 
  <div class="text-center mt-4">
    <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {#each $books as book (book.id)}
        <BookCard {book} />
      {:else}
        <div>検索結果が見つかりませんでした。</div>
      {/each}
    </div>
    <InfiniteScroll window threshold={100} on:loadMore={handleLoadMore} {hasMore} />

    {#await promise}
      <div class="flex justify-center"><Spinner /></div>
      {:catch e}
        <span class="text-red-600 text-sm">
          {e.message}
        </span>
    {/await}
  </div>
</div>

