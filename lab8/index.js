const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

// PostgreSQL connection settings
const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'users_db',
  password: 'pwd', // Use a strong password in production
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
