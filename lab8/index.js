// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part C.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
});

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here
app.get('/', (req, res) => {
    res.redirect('/login'); //this will call the /anotherRoute route in the API
  });
  
  app.get('/anotherRoute', (req, res) => {
    //do something
    res.send(`Hello, World! This is anotherRoute.`);
  });

app.get('/register', (req, res) => {
res.render('pages/register');
});

app.post('/register', async (req, res) => {
    try {
      // Hash the password using bcrypt library
      const hash = await bcrypt.hash(req.body.password, 10);
      
      // Insert username and hashed password into the 'users' table
      const insertQuery = 'INSERT INTO users(username, password) VALUES($1, $2)';
      await db.none(insertQuery, [req.body.username, hash]);
  
      // Redirect to login page after successful registration
      res.redirect('/login');
    } catch (error) {
      // If there's an error (e.g., username already exists), redirect back to register
      // Optionally, you could also pass an error message to be displayed
      console.error('Registration error:', error);
      res.render('pages/register', { message: 'Registration failed. Please try again.', error: true });
    }
  });

app.get('/login', (req, res) => {
// Check if user is already logged in
if (req.session.user) {
    return res.redirect('/discover'); // Redirect to discover if already logged in
}
res.render('pages/login'); // Render the login page
});
  
app.post('/login', async (req, res) => {
    try {
      // Retrieve user from the database
      const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [req.body.username]);
      
      // If user does not exist or password does not match
      if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.render('pages/login', { message: 'Incorrect username or password.', error: true });
      }
      
      // Set user info in session
      req.session.user = { username: user.username };
      res.redirect('discover'); // Redirect to the discover page on successful login
    } catch (error) {
      console.error('Login error:', error);
      res.render('pages/login', { message: 'Login failed. Please try again.', error: true });
    }
  });
  
  app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.render('pages/logout', { message: 'Logout failed. Please try again.', error: true });
      }
      // Render the logout page with a success message
      res.render('pages/logout', { message: 'Logged out successfully.' });
    });
  });
  
  app.get('/discover', async (req, res) => {
    try {
      // Replace '<any artist>' with your chosen keyword and <number of search results> with 10 or however many events you want
      const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
        params: {
          apikey: process.env.API_KEY,
        //   keyword: '<any artist>',
          size: 10
        }
      });
  
      // The API response data is in `response.data`, we need to format it for our use
      const events = response.data._embedded.events.map(event => {
        return {
          name: event.name,
          image: event.images[0]?.url || 'default-image-url.jpg', // Replace 'default-image-url.jpg' with the path to your default image
          date: event.dates.start.localDate,
          time: event.dates.start.localTime,
          url: event.url
        };
      });

    //   res.send(`${JSON.stringify(events, null, 2)}`);
      
      // Render discover page with the events data
      res.render('pages/discover', { events: events });
  
    } catch (error) {
      console.error('Error fetching events: ', error);
      // Render discover page with empty array if API call fails
      res.render('pages/discover', { events: [], message: 'Failed to load events', error: true });
    }
  });
  

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');