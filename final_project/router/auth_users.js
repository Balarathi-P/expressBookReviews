const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    
if(username.length < 3 || username.length > 20){

    return false;
}

const validPattern = /^[a-zA-Z0-9_-]+$/;

if(!validPattern.test(username)){

    return false;
}

return users.some(user => user.username === username);

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    return users.some(user => user.username == username && user.password == password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  console.log("Inside");

  if(!username || !password){

    return res.status(400).json({message : "Please Enter the Username or Password"});
  }

  if(!isValid(username)){

    return res.status(400).json({message : "Invalid Username"});
  }

  if(!authenticatedUser(username,password)){

    return res.status(400).json({message : "Invalid Password"});
  }

  let token = jwt.sign({ username }, "user_key", { expiresIn: "1h" });

  req.session.authorization = {token, username};

  return res.status(200).json({ message: "Login successful", token });
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const {isbn} = req.params;
  const review = req.query.review;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "Unauthorized: Please log in first" });
    }
  const username = req.session.authorization.username;

  if(!review) return res.status(400).json({message : "Review is Required"});

  books[isbn].reviews[username] = review;

  res.json({message : "Review posted Successfully" ,
  reviews : books[isbn].reviews
});

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
