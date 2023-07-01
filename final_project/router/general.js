const express = require('express');
let books = require("./booksdb.js");
let {users} = require("./auth_users.js");
const public_users = express.Router();


public_users.post("/register", (req, res) => {

  if (req.body.username && req.body.password) {
    const obj = {
      username: req.body.username,
      password: req.body.password
    }
    users.push(obj); 
    res.status(201).send('User registered'); 
  }
  else
  {
    res.status(400).send('Please provide both username and password'); 
  }
});

// Get the book list available in the shop
public_users.get('/', async(req, res) => {
  const books = await books.json; 
  if (books) {
    res.status(200).send(books);
  }
  else {
    res.send(404).send("Can't retrieve books");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async(req, res) => {
  const isbn = req.params.isbn;
  const book = await books[isbn];
  if (book) {
    res.status(200).send(book);
  }
  else {
    res.status(404).send('No book with given isbn found');
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  let author = req.params.author;
  author = author.toString();
  
  const func = (author, books) =>
  {
    let book = []; 
    for (bk in books) {
      if (books[bk].author === author) {
        book.push(books[bk]);
      }
    }
    return book; 
  }
  const book = await func(author, books); 
  
  if (book.length > 0) {
    res.status(200).send(book);
  }
  else {
    res.status(404).send('No book with given author found');
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  let title = req.params.title;
  title = title.toString();
  const func = (title, books) => {
    let book = []
    for (bk in books) {
      if (books[bk].title === title) {
        book.push(books[bk]);
      }
    }
    return book; 
  }

  const book = await func(title, books); 
  
  if (book.length > 0) {
    res.status(200).send(book);
  }
  else {
    res.status(404).send('No book with given title found');
  }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const book = await books[isbn];
  if (book) {
    res.status(200).send(book.reviews);
  }
  else {
    res.status(404).send('No book with given isbn found');
  }
});

module.exports.general = public_users;