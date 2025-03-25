const express = require('express');
let books = require("./booksdb.js");
const session = require('express-session');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username,password} = req.body;

  if(!username||!password){
    return res.status(400).send("Username and Password are required");
  }

  const userExists = users.find(user => user.username === username);

  if(userExists){

    return res.status(400).send("Username already exists");
  }

  const newUser = {username, password};
  users.push(newUser);
  res.status(201).json(users);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let bookNo = req.params.isbn;
  
  res.json(books[bookNo]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  for(let key in books){

    if(books[key]["author"] == author){

        res.json(books[key]);
        res.end(); 
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;

  for(let key in books){

    if(books[key]["title"] == title){

        res.json(books[key]);
        res.end();
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  res.json(books[isbn]["reviews"]);
  res.end();
});

module.exports.general = public_users;
