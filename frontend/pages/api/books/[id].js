import { getBookById, updateBook, deleteBook, isbnExists } from '../../../lib/db';

const PASSWORD = '20040611';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    
    if (req.method === 'GET') {
      const book = getBookById(id);
      
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      res.status(200).json({ book });
    } else if (req.method === 'PUT') {
      const { password, ...data } = req.body;
      
      if (password !== PASSWORD) {
        return res.status(403).json({ error: '密码错误，无法编辑' });
      }
      
      const existing = getBookById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: 'No data provided' });
      }
      
      if (data.isbn !== undefined && data.isbn && isbnExists(data.isbn, id)) {
        return res.status(400).json({ error: 'ISBN already exists' });
      }
      
      const updated = updateBook(id, data);
      res.status(200).json({ book: updated });
    } else if (req.method === 'DELETE') {
      const { password } = req.body;
      
      if (password !== PASSWORD) {
        return res.status(403).json({ error: '密码错误，无法删除' });
      }
      
      const existing = getBookById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      deleteBook(id);
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
