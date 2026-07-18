let books = [];
let nextId = 1;

const sampleBooks = [
  { title: '活着', author: '余华', isbn: '9787506358164', category: '文学小说', description: '讲述了一个人一生的故事，这是一个历尽世间沧桑和磨难老人的人生感言。', total_copies: 5, available_copies: 3 },
  { title: '三体', author: '刘慈欣', isbn: '9787536692930', category: '科幻小说', description: '地球文明向宇宙发出的第一声啼鸣，以太阳为中心，以光速向宇宙深处飞驰……', total_copies: 4, available_copies: 2 },
  { title: '百年孤独', author: '加西亚·马尔克斯', isbn: '9787544230335', category: '文学小说', description: '马孔多镇布恩迪亚家族七代人的传奇故事，魔幻现实主义文学的代表作。', total_copies: 3, available_copies: 1 },
  { title: '红楼梦', author: '曹雪芹', isbn: '9787020002200', category: '古典文学', description: '中国古典四大名著之一，以贾宝玉和林黛玉的爱情悲剧为主线。', total_copies: 6, available_copies: 4 },
  { title: '三国演义', author: '罗贯中', isbn: '9787020002217', category: '古典文学', description: '中国古典四大名著之一，描写了从东汉末年到西晋初年之间近百年的历史风云。', total_copies: 5, available_copies: 3 },
  { title: '水浒传', author: '施耐庵', isbn: '9787020002224', category: '古典文学', description: '中国古典四大名著之一，描写了108位好汉在梁山起义的故事。', total_copies: 4, available_copies: 2 },
  { title: '西游记', author: '吴承恩', isbn: '9787020002231', category: '古典文学', description: '中国古典四大名著之一，讲述了唐僧师徒四人西天取经的故事。', total_copies: 5, available_copies: 3 },
  { title: '围城', author: '钱钟书', isbn: '9787020002248', category: '文学小说', description: '被誉为"新儒林外史"，描写了抗战初期知识分子的生活百态。', total_copies: 3, available_copies: 2 },
  { title: '骆驼祥子', author: '老舍', isbn: '9787020002255', category: '文学小说', description: '讲述了北平一个年轻好强、充满生命活力的人力车夫祥子的人生经历。', total_copies: 4, available_copies: 3 },
  { title: '呐喊', author: '鲁迅', isbn: '9787020002262', category: '文学小说', description: '中国现代文学的奠基之作，收录了鲁迅先生的短篇小说。', total_copies: 5, available_copies: 4 },
  { title: '彷徨', author: '鲁迅', isbn: '9787020002279', category: '文学小说', description: '鲁迅的第二部短篇小说集，展现了知识分子在社会变革中的迷茫。', total_copies: 3, available_copies: 2 },
  { title: '子夜', author: '茅盾', isbn: '9787020002286', category: '文学小说', description: '中国现代长篇小说的里程碑，描写了20世纪30年代上海的社会生活。', total_copies: 4, available_copies: 1 },
  { title: '平凡的世界', author: '路遥', isbn: '9787530203801', category: '文学小说', description: '以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛刻画了当时社会各阶层众多普通人的形象。', total_copies: 6, available_copies: 5 },
  { title: '白鹿原', author: '陈忠实', isbn: '9787506310768', category: '文学小说', description: '一部渭河平原五十年变迁的雄奇史诗，一幅中国农村斑斓多彩、触目惊心的长卷。', total_copies: 4, available_copies: 2 },
  { title: '万历十五年', author: '黄仁宇', isbn: '9787101022142', category: '历史传记', description: '从一个特殊的年份切入，探讨明代社会的症结。', total_copies: 3, available_copies: 2 },
  { title: '明朝那些事儿', author: '当年明月', isbn: '9787801653753', category: '历史传记', description: '以史料为基础，以年代和具体人物为主线，全景式展现明朝两百多年的历史。', total_copies: 5, available_copies: 4 },
  { title: '人类简史', author: '尤瓦尔·赫拉利', isbn: '9787508653883', category: '人文社科', description: '从认知革命、农业革命到科学革命，重新审视人类历史。', total_copies: 4, available_copies: 3 },
  { title: '时间简史', author: '史蒂芬·霍金', isbn: '9787535732309', category: '科普读物', description: '探索时间和空间的核心秘密，解释宇宙的起源和命运。', total_copies: 5, available_copies: 4 },
  { title: '小王子', author: '圣埃克苏佩里', isbn: '9787020042509', category: '童话寓言', description: '一本永恒的童话，献给曾经是孩子的大人们。', total_copies: 6, available_copies: 5 },
  { title: '安徒生童话', author: '安徒生', isbn: '9787020002293', category: '童话寓言', description: '收录了安徒生最经典的童话故事。', total_copies: 4, available_copies: 3 },
  { title: '格林童话', author: '格林兄弟', isbn: '9787020002309', category: '童话寓言', description: '德国民间故事集，包含许多经典童话。', total_copies: 3, available_copies: 2 },
  { title: '一千零一夜', author: '佚名', isbn: '9787020002316', category: '童话寓言', description: '阿拉伯民间故事集，讲述了山鲁佐德为拯救自己而讲述故事的传奇。', total_copies: 4, available_copies: 3 },
  { title: '伊索寓言', author: '伊索', isbn: '9787020002323', category: '童话寓言', description: '古希腊寓言集，通过动物故事传达人生哲理。', total_copies: 3, available_copies: 2 },
  { title: '唐诗三百首', author: '蘅塘退士', isbn: '9787020002330', category: '古典文学', description: '中国古代诗歌选本，收录了唐代最著名的诗篇。', total_copies: 5, available_copies: 4 },
  { title: '宋词选', author: '胡云翼', isbn: '9787020002347', category: '古典文学', description: '精选宋代名家词作，展现宋词的艺术魅力。', total_copies: 4, available_copies: 3 },
  { title: '元曲选', author: '臧懋循', isbn: '9787020002354', category: '古典文学', description: '元代戏曲选集，收录了关汉卿、马致远等名家作品。', total_copies: 3, available_copies: 2 },
  { title: '古文观止', author: '吴楚材', isbn: '9787020002361', category: '古典文学', description: '中国古代散文选本，涵盖了从先秦到明末的优秀散文。', total_copies: 4, available_copies: 3 },
  { title: '史记', author: '司马迁', isbn: '9787020002378', category: '历史传记', description: '中国第一部纪传体通史，记载了从黄帝到汉武帝时期的历史。', total_copies: 5, available_copies: 4 },
  { title: '资治通鉴', author: '司马光', isbn: '9787020002385', category: '历史传记', description: '中国第一部编年体通史，记载了从战国到五代的历史。', total_copies: 4, available_copies: 2 },
  { title: '本草纲目', author: '李时珍', isbn: '9787020002392', category: '科普读物', description: '中国古代药学巨著，收录了数千种药物。', total_copies: 3, available_copies: 1 },
  { title: '天工开物', author: '宋应星', isbn: '9787020002408', category: '科普读物', description: '中国古代工艺技术百科全书。', total_copies: 4, available_copies: 3 },
  { title: '孙子兵法', author: '孙武', isbn: '9787020002415', category: '人文社科', description: '中国古代军事学经典著作。', total_copies: 5, available_copies: 4 },
  { title: '道德经', author: '老子', isbn: '9787020002422', category: '人文社科', description: '道家思想的代表作，阐述了老子的哲学思想。', total_copies: 4, available_copies: 3 },
  { title: '论语', author: '孔子', isbn: '9787020002439', category: '人文社科', description: '儒家经典著作，记录了孔子及其弟子的言行。', total_copies: 5, available_copies: 4 },
];

function initBooks() {
  if (books.length === 0) {
    const now = new Date().toISOString();
    books = sampleBooks.map((book, index) => ({
      id: index + 1,
      ...book,
      created_at: now,
      updated_at: now,
    }));
    nextId = books.length + 1;
  }
}

export function getAllBooks() {
  initBooks();
  return [...books];
}

export function getBookById(id) {
  initBooks();
  return books.find(b => b.id === parseInt(id));
}

export function addBook(bookData) {
  initBooks();
  const now = new Date().toISOString();
  const newBook = {
    id: nextId++,
    title: bookData.title,
    author: bookData.author,
    isbn: bookData.isbn,
    category: bookData.category,
    description: bookData.description,
    total_copies: parseInt(bookData.total_copies) || 1,
    available_copies: parseInt(bookData.available_copies) || 1,
    created_at: now,
    updated_at: now,
  };
  books.push(newBook);
  return newBook;
}

export function updateBook(id, bookData) {
  initBooks();
  const index = books.findIndex(b => b.id === parseInt(id));
  if (index === -1) return null;
  
  const now = new Date().toISOString();
  books[index] = {
    ...books[index],
    ...bookData,
    total_copies: bookData.total_copies !== undefined ? parseInt(bookData.total_copies) : books[index].total_copies,
    available_copies: bookData.available_copies !== undefined ? parseInt(bookData.available_copies) : books[index].available_copies,
    updated_at: now,
  };
  return books[index];
}

export function deleteBook(id) {
  initBooks();
  const index = books.findIndex(b => b.id === parseInt(id));
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
}

export function getCategories() {
  initBooks();
  const categories = [...new Set(books.map(b => b.category).filter(c => c))];
  return categories;
}

export function getStats() {
  initBooks();
  const totalBooks = books.length;
  const categories = getCategories();
  const totalCategories = categories.length;
  const totalCopies = books.reduce((sum, b) => sum + (b.total_copies || 0), 0);
  const availableCopies = books.reduce((sum, b) => sum + (b.available_copies || 0), 0);
  const borrowedCopies = totalCopies - availableCopies;
  const availableRatio = totalCopies > 0 ? Math.round((availableCopies / totalCopies) * 100 * 10) / 10 : 0;
  
  const categoryCount = {};
  books.forEach(b => {
    if (b.category) {
      categoryCount[b.category] = (categoryCount[b.category] || 0) + 1;
    }
  });
  
  const categoryDistribution = Object.entries(categoryCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  
  return {
    total_books: totalBooks,
    total_categories: totalCategories,
    total_copies: totalCopies,
    available_copies: availableCopies,
    borrowed_copies: borrowedCopies,
    available_ratio: availableRatio,
    category_distribution: categoryDistribution,
  };
}

export function isbnExists(isbn, excludeId = null) {
  initBooks();
  return books.some(b => b.isbn === isbn && (!excludeId || b.id !== parseInt(excludeId)));
}
