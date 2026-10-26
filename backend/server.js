const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0124446280',
  database: 'library'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const insertQuery = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    db.query(insertQuery, [name || email.split('@')[0], email, password], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register' });
      res.json({ message: 'User registered successfully', user_id: result.insertId });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE (email = ? OR name = ?) AND password_hash = ?';
  db.query(query, [email, email, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }
    const user = results[0];
    res.json({ message: 'Login successful', user_id: user.user_id, name: user.name, email: user.email });
  });
});

app.get('/authors', (req, res) => {
  const userId = req.query.user_id;
  const query = userId ? 'SELECT * FROM AUTHOR WHERE user_id = ?' : 'SELECT * FROM AUTHOR';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/authors', (req, res) => {
  const { name, country, user_id } = req.body;
  const query = 'INSERT INTO AUTHOR (name, country, user_id) VALUES (?, ?, ?)';
  db.query(query, [name, country, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add author' });
    res.json({ message: 'Author added successfully', author_id: result.insertId });
  });
});

app.put('/authors/:id', (req, res) => {
  const { id } = req.params;
  const { name, country } = req.body;
  const query = 'UPDATE AUTHOR SET name = ?, country = ? WHERE author_id = ?';
  db.query(query, [name, country, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update author' });
    res.json({ message: 'Author updated successfully' });
  });
});

app.delete('/authors/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM AUTHOR WHERE author_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete author' });
    res.json({ message: 'Author deleted successfully' });
  });
});

app.get('/books', (req, res) => {
  const userId = req.query.user_id;
  const query = userId ? 'SELECT * FROM BOOK WHERE user_id = ?' : 'SELECT * FROM BOOK';
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/books', (req, res) => {
  const { title, price, author_id, user_id } = req.body;
  const query = 'INSERT INTO BOOK (title, price, author_id, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [title, price, author_id, user_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add book' });
    res.json({ message: 'Book added successfully', book_id: result.insertId });
  });
});

app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, price, author_id } = req.body;
  const query = 'UPDATE BOOK SET title = ?, price = ?, author_id = ? WHERE book_id = ?';
  db.query(query, [title, price, author_id, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to update book' });
    res.json({ message: 'Book updated successfully' });
  });
});

app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM BOOK WHERE book_id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete book' });
    res.json({ message: 'Book deleted successfully' });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});