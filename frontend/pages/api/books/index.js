import { getAllBooks, addBook, isbnExists } from '../../../lib/db';
import { matchSearch } from '../../../lib/pinyin';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { page = 1, per_page = 8, search = '', category = '' } = req.query;
      
      let allBooks = getAllBooks();
      
      if (category) {
        allBooks = allBooks.filter(b => b.category === category);
      }
      
      let filteredBooks = allBooks;
      if (search) {
        filteredBooks = allBooks.filter(book => matchSearch(book, search));
      }
      
      const total = filteredBooks.length;
      const pages = Math.max(1, Math.ceil(total / per_page));
      const start = (page - 1) * per_page;
      const books = filteredBooks.slice(start, start + parseInt(per_page));
      
      res.status(200).json({
        books,
        total,
        page: parseInt(page),
        per_page: parseInt(per_page),
        pages,
      });
    } else if (req.method === 'POST') {
      const { title, author, isbn, category, description, total_copies = 1, available_copies = 1 } = req.body;
      
      if (!title || !author) {
        return res.status(400).json({ error: 'Title and author are required' });
      }
      
      if (isbn && isbnExists(isbn)) {
        return res.status(400).json({ error: 'ISBN already exists' });
      }
      
      const newBook = addBook({
        title,
        author,
        isbn,
        category,
        description,
        total_copies,
        available_copies,
      });
      
      res.status(201).json({ book: newBook });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
