import Link from 'next/link';
import styles from '../styles/BookCard.module.css';

export default function BookCard({ book }) {
  if (!book) return null;

  const getBookEmoji = (category) => {
    const emojiMap = {
      '编程': '💻',
      '文学': '📖',
      '历史': '🏛️',
      '科学': '🔬',
      '小说': '📚',
      '教育': '🎓',
      '艺术': '🎨',
      '经济': '💰',
      '哲学': '🧠',
      '传记': '👤',
      '计算机': '🖥️',
      '数学': '🔢',
      '物理': '⚛️',
      '化学': '🧪',
      '生物': '🧬',
      '医学': '🏥',
      '法律': '⚖️',
      '心理': '❤️',
      '社会': '👥',
      '政治': '🏛️',
      '军事': '⚔️',
      '地理': '🌍',
      '天文': '🔭',
      '音乐': '🎵',
      '电影': '🎬',
      '摄影': '📷',
      '美食': '🍜',
      '旅行': '✈️',
      '运动': '⚽',
      '游戏': '🎮',
      '漫画': '📕',
      '童话': '🧚',
      '诗歌': '📝',
      '散文': '📄',
      '戏剧': '🎭',
      '语言': '🗣️',
      '宗教': '🕉️',
      '建筑': '🏗️',
      '设计': '✏️',
      '管理': '📊',
      '营销': '📢',
      '金融': '💹',
      '投资': '📈',
      '会计': '🧮',
      '农业': '🌾',
      '工业': '🏭',
      '交通': '🚗',
      '环境': '🌱',
      '宠物': '🐶',
      '育儿': '👶',
      '养生': '🧘',
    };
    return emojiMap[category] || '📕';
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.bookCover}>
          {getBookEmoji(book.category)}
        </div>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>
        {book.category && (
          <span className={styles.category}>{book.category}</span>
        )}
        <div className={styles.info}>
          <span className={book.available_copies > 0 ? styles.inStock : styles.outOfStock}>
            {book.available_copies > 0 ? '可借' : '已借完'}
          </span>
          <span className={styles.copies}>
            {book.available_copies}/{book.total_copies} 本
          </span>
        </div>
        {book.description && (
          <p className={styles.description}>
            {book.description.length > 80
              ? book.description.substring(0, 80) + '...'
              : book.description}
          </p>
        )}
        <Link href={`/books/${book.id}`} className={styles.detailLink}>
          查看详情
        </Link>
      </div>
    </div>
  );
}
