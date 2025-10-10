const express = require('express');
const app = express();
const db = require('./db');

app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = " + userId;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
