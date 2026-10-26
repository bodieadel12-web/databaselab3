const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '0124446280',
  database: 'library'
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.json({ success: true, user_id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? OR name = ?', [email, email]);
    if (rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: 'Invalid password' });
    
    res.json({ success: true, user_id: user.user_id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/authors', async (req, res) => {
  try {
    const { user_id } = req.query;
    const [rows] = await db.execute('SELECT * FROM AUTHOR WHERE user_id = ?', [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/authors', async (req, res) => {
  try {
    const { name, country, image_url, user_id } = req.body;
    const [result] = await db.execute(
      'INSERT INTO AUTHOR (name, country, image_url, user_id) VALUES (?, ?, ?, ?)',
      [name, country, image_url || null, user_id]
    );
    res.json({ success: true, author_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country, image_url } = req.body;
    await db.execute(
      'UPDATE AUTHOR SET name = ?, country = ?, image_url = ? WHERE author_id = ?',
      [name, country, image_url || null, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/authors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM AUTHOR WHERE author_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/books', async (req, res) => {
  try {
    const { user_id } = req.query;
    const [rows] = await db.execute('SELECT * FROM BOOK WHERE user_id = ?', [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/books', async (req, res) => {
  try {
    const { title, price, author_id, image_url, user_id } = req.body;
    const [result] = await db.execute(
      'INSERT INTO BOOK (title, price, author_id, image_url, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, price, author_id, image_url || null, user_id]
    );
    res.json({ success: true, book_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, author_id, image_url } = req.body;
    await db.execute(
      'UPDATE BOOK SET title = ?, price = ?, author_id = ?, image_url = ? WHERE book_id = ?',
      [title, price, author_id, image_url || null, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute('DELETE FROM BOOK WHERE book_id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});