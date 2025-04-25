const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // <-- Import db connection

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API route to handle email subscription
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const query = 'INSERT INTO emails (email) VALUES (?)';
  db.query(query, [email], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      console.error('Failed to insert email:', err);
      return res.status(500).json({ message: 'Failed to save email' });
    }

    res.status(200).json({ message: 'Subscription successful!' });
  });
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
