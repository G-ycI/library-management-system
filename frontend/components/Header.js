import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            📚 图书管理系统
          </Link>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              图书列表
            </Link>
            <Link href="/books/add" className={styles.navLink}>
              新增图书
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
