const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));


// Registration page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/registration.html'));
});
//login page route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});



// MySQL Connection
const conn = mysql.createConnection({

host: "localhost",
user: "root",
password: "123456",
database: "test"

});

conn.connect((err) => {
if (err) throw err;
console.log("Connected to Database");
});

// Register Data Insert
app.post('/', (req, res) => {

const { firstName, surname, email, password } = req.body;

const sql = "INSERT INTO users (first_name, surname, email, password) VALUES (?, ?, ?, ?)";

conn.query(sql, [firstName, surname, email, password], (err, result) => {

if (err) throw err;

res.sendFile(path.join(__dirname, 'public', 'success.html'));

});
});
//login authetication
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    conn.query(sql, [email, password], (err, result) => {

        if (err) throw err;

        if (result.length > 0) {

            res.sendFile(path.join(__dirname, 'dashboard.html'));

        } else {

            res.send(`
            <h2>Invalid Email or Password</h2>
            <a href="/login">Try Again</a>
            `);

        }
    });

});


// Server Start
app.listen(3000, () => {
console.log("Server Running at http://localhost:3000");
});
