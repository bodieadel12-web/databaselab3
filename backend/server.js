const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); 

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)', 
      [email, name, password_hash]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email Already Exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query(
      'SELECT user_id, name, password_hash FROM users WHERE email = ?', 
      [email]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, users[0].password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', name: users[0].name, user_id: users[0].user_id });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});