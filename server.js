const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

// Middleware for parsing JSON request bodies
app.use(bodyParser.json());

// Create a database connection
const db = new sqlite3.Database('./src/db.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Connected to the database');
    }
  });
  
  // Handle database errors
  db.on('error', (err) => {
    console.error('Database error:', err);
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  
 // Get all Pokémon from the database
app.get('/api/pokemon', (req, res) => {
    const query = 'SELECT * FROM pokemon';
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(rows);
      }
    });
  });
  
  // Get a specific Pokémon by ID from the database
  app.get('/api/pokemon/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pokemon WHERE id = ?';
    db.get(query, [id], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
      } else if (row) {
        res.json(row);
      } else {
        res.status(404).json({ message: 'Pokémon not found' });
      }
    });
  });
  
  // Create a new Pokémon entry in the database
  app.post('/api/pokemon', (req, res) => {
    const { name, type, imageUrl, hp, attack, defense } = req.body;

    // Capitalize imageUrl
    const cap = type[0].toUpperCase() + type.slice(1);

    const query = `
      INSERT INTO pokemon (name, type, hp, attack, defense, sprite, thumbnail, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, cap, hp, attack, defense, imageUrl, imageUrl, imageUrl], (err) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ message: 'Pokémon created successfully' });
      }
    });
  });
  
  // Update an existing Pokémon entry by ID in the database
  app.put('/api/pokemon/:id', (req, res) => {
    const { id } = req.params;
    const { hp, attack, defense } = req.body;
    const query = `
      UPDATE pokemon
      SET hp = ?, attack = ?, defense = ?
      WHERE id = ?`;
    db.run(query, [hp, attack, defense, id], (err) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ message: 'Pokémon updated successfully' });
      }
    });
  });
  
  // Delete a Pokémon entry by ID from the database
  app.delete('/api/pokemon/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pokemon WHERE id = ?';
    db.run(query, [id], (err) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ message: 'Pokémon deleted successfully' });
      }
    });
  });
  
// Close the database connection when the server stops
app.on('close', () => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  });