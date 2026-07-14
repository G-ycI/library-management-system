import Link from 'next/link';
import styles from '../styles/BookCard.module.css';

export default function BookCard({ book }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>作者：{book.author}</p>
        {book.category && (
          <span className={styles.category}>{book.category}</span>
        )}
        <div className={styles.info}>
          <span className={book.available_copies > 0 ? styles.inStock : styles.outOfStock}>
            {book.available_copies > 0 ? '可借' : '已借完'}
          </span>
          <span className={styles.copies}>
            馆藏：{book.total_copies} / 可借：{book.available_copies}
          </span>
        </div>
        {book.description && (
          <p className={styles.description}>
            {book.description.length > 100
              ? book.description.substring(0, 100) + '...'
              : book.description}
          </p>
        )}
        <Link href={`/books/${book.id}`} className={styles.detailLink}>
          查看详情 →
        </Link>
      </div>
    </div>
  );
}
