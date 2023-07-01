const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  if (authenticatedUser(req.body.username, req.body.password)) {
    const playload = {
      username: req.body.username,
      password: req.body.password
    }
    const token = jwt.sign(playload, 'access', { expiresIn: 60 * 60 })
    req.session.authentication = {
      token, playload
    }

    res.status(200).send('Login successful');
  }

  else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authentication.playload.username
  const review = req.body.review;
  const isbn = req.params.isbn;
  if (review ) {
    if(books[isbn])
    {
      books[isbn].reviews[`${username}`] = review;
      res.status(200).send('Book review added')
    }
    else 
    {
      res.status(404).send('book at given isbn not found');
    }
  }
  else {
    res.status(404).send('Review to be added not found');
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.authentication.playload.username; 
  const isbn = req.params.isbn; 

  if(books[isbn])
  {
    if(books[isbn].reviews[`${username}`])
    {
      delete books[isbn].reviews[`${username}`]; 
      res.status(200).send('Review deleted successfuly'); 
    }
    else 
    {
      res.status(404).send('Review not found');
    }
  }
  else
  {
    res.status(404).send('book at given isbn not found');
  }
});

module.exports.authenticated = regd_users;
module.exports.users = users;