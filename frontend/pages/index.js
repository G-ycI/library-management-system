import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  // 搜索防抖：输入停止 300ms 后才发请求
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearch, category, page]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/books/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/books/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        per_page: 8,
      });
      if (debouncedSearch) params.append('search', debouncedSearch);
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

  const totalPages = Math.ceil(total / 8);

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

          {/* 数据统计面板 */}
          {stats && (
            <div className={styles.statsPanel}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📚</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{stats.total_books}</div>
                    <div className={styles.statLabel}>图书总数</div>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>🏷️</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{stats.total_categories}</div>
                    <div className={styles.statLabel}>分类数量</div>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>📦</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{stats.total_copies}</div>
                    <div className={styles.statLabel}>馆藏总量</div>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>✅</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statValue}>{stats.available_copies}</div>
                    <div className={styles.statLabel}>可借数量</div>
                  </div>
                </div>
              </div>
              <div className={styles.statsFooter}>
                <div className={styles.ratioBar}>
                  <div 
                    className={styles.ratioFill} 
                    style={{ width: `${stats.available_ratio}%` }}
                  ></div>
                </div>
                <div className={styles.ratioText}>
                  可借比例 {stats.available_ratio}% | 已借出 {stats.borrowed_copies} 本
                </div>
              </div>
            </div>
          )}

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="搜索书名、作者或拼音..."
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
          ) : (!books || books.length === 0) ? (
            <div className={styles.empty}>
              <p>暂无图书数据</p>
            </div>
          ) : (
            <>
              <div className={styles.bookGrid}>
                {books.filter(book => book && book.id).map((book) => (
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
