import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [search, category, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/books/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        per_page: 6,
      });
      if (search) params.append('search', search);
      if (category) params.append('category', category);

      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      setBooks(data.books || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / 6);

  return (
    <div>
      <Head>
        <title>图书管理系统 - 图书列表</title>
        <meta name="description" content="图书管理系统 - 浏览和管理图书" />
      </Head>
      <Header />
      <main className="container">
        <div className={styles.mainContent}>
          <h1 className={styles.pageTitle}>图书列表</h1>
          <p className={styles.subtitle}>共 {total} 本图书</p>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="搜索书名或作者..."
                value={search}
                onChange={handleSearch}
                className={styles.searchInput}
              />
            </div>
            <select
              value={category}
              onChange={handleCategoryChange}
              className={styles.categorySelect}
            >
              <option value="">全部分类</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : books.length === 0 ? (
            <div className={styles.empty}>
              <p>暂无图书数据</p>
            </div>
          ) : (
            <>
              <div className={styles.bookGrid}>
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={styles.pageBtn}
                  >
                    上一页
                  </button>
                  <span className={styles.pageInfo}>
                    第 {page} / {totalPages} 页
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={styles.pageBtn}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
