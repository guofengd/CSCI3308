const express = require('express');
const session = require('express-session');
const { engine }  = require('express-handlebars');

const app = express();
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

// Set up Handlebars middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Set up session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.render('home');
});

// Serve the login form
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
app.post('/login', (req, res) => {
    const { username } = req.body;
    req.session.user = { username };
    res.redirect('/home');
});


app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
