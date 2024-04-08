const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

// PostgreSQL connection settings
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'mydatabase',
  password: 'password', // Use a strong password in production
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() as now');
    res.send(`Server time is ${rows[0].now}`);
  } catch (e) {
    console.error(e.stack);
    res.status(500).send('Error connecting to the database');
  }
});

app.get('/search', async (req, res) => {
    const { name } = req.query; // Get the search parameter from the query string

    try {
        const query = `
            SELECT * FROM users
            WHERE name LIKE $1; -- Case-insensitive partial match
        `;
        const values = [`%${name}%`]; // Wrap the search term in % for partial match

        const { rows } = await pool.query(query, values);
        res.json(rows); // Send back the search results
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error while searching for users');
    }
});

app.post('/addUser', async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
  
      // Assuming 'id' is an auto-incremented primary key
      console.log(`A new user has been added with ID: ${result.rows[0].id}`);
      res.status(201).json({
        status: 'success',
        data: {
          user: result.rows[0],
        },
      });
    } catch (err) {
      console.error(err.stack);
      res.status(500).send('Error adding the user');
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
