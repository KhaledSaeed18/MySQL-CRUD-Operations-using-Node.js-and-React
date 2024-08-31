import express from 'express';
import mysql2 from 'mysql2';
import cors from 'cors';

// Create a new express application instance
const app = express();

app.use(express.json());

app.use(cors());

// establish connection to the database
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'express'
});

// check if the connection is successful
db.connect((err) => {
    if (err) {
        console.log('Error connecting to Db' + err);
        return;
    }
    console.log('Connection established');
});

app.get('/', (req, res) => {
    res.json('Hello World');
});

// create a new route to fetch all books from the database
app.get("/books", (req, res) => {
    const q = 'SELECT * FROM books'; // query to fetch all books
    db.query(q, (err, data) => {
        if (err) {
            return res.json(err); // return the error message if there is an error
        }
        res.json(data); // return the data if there is no error as a json object
    });
});

app.post("/books", (req, res) => {
    const q = "INSERT INTO books (`title`,`description`,`cover`,`price`) VALUES (?)";
    const data =
        [
            req.body.title,
            req.body.description,
            req.body.cover,
            req.body.price
        ];
    db.query(q, [data], (err, data) => {
        if (err) {
            return res.json(err);
        }
        res.json("Book added successfully");
    });
});

app.delete("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "DELETE FROM books WHERE id = ?";
    db.query(q, [bookId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        res.json("Book deleted successfully");
    });
});


app.put("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "UPDATE books SET `title` = ?, `description` = ?, `cover` = ?, `price` = ? WHERE id = ?";
    const data =
        [
            req.body.title,
            req.body.description,
            req.body.cover,
            req.body.price,
        ];
    db.query(q, [...data, bookId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        res.json("Book updated successfully");
    });
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});