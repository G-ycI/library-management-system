import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import styles from '../../styles/BookDetail.module.css';

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) {
        throw new Error('图书不存在');
      }
      const data = await res.json();
      setBook(data.book);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这本图书吗？')) return;

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/');
      } else {
        alert('删除失败');
      }
    } catch (err) {
      alert('删除失败');
    }
  };

  return (
    <div>
      <Head>
        <title>{book ? `${book.title} - 图书详情` : '图书详情'}</title>
      </Head>
      <Header />
      <main className="container">
        <div className={styles.mainContent}>
          <Link href="/" className={styles.backLink}>
            ← 返回列表
          </Link>

          {loading ? (
            <div className={styles.loading}>加载中...</div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <Link href="/" className={styles.backBtn}>
                返回列表
              </Link>
            </div>
          ) : book ? (
            <div className={styles.detailCard}>
              <div className={styles.bookHeader}>
                <h1 className={styles.title}>{book.title}</h1>
                {book.category && (
                  <span className={styles.category}>{book.category}</span>
                )}
              </div>

              <div className={styles.bookInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>作者</span>
                  <span className={styles.value}>{book.author}</span>
                </div>
                {book.isbn && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>ISBN</span>
                    <span className={styles.value}>{book.isbn}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.label}>馆藏数量</span>
                  <span className={styles.value}>{book.total_copies} 本</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>可借数量</span>
                  <span
                    className={
                      book.available_copies > 0
                        ? styles.inStock
                        : styles.outOfStock
                    }
                  >
                    {book.available_copies} 本
                  </span>
                </div>
                {book.created_at && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>入库时间</span>
                    <span className={styles.value}>
                      {new Date(book.created_at).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </div>

              {book.description && (
                <div className={styles.description}>
                  <h3 className={styles.descTitle}>内容简介</h3>
                  <p className={styles.descText}>{book.description}</p>
                </div>
              )}

              <div className={styles.actions}>
                <button onClick={handleDelete} className={styles.deleteBtn}>
                  删除图书
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
