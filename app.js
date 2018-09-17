var express = require("express");
var app = express();
var pgp = require("pg-promise")();
const jwt = require("jsonwebtoken");

var cn =
  "postgres://tghowiiwbpkukb:26c4126838e723431a8a6a3dac211499d3eb54da7f47892f71128ba21f5b610a@ec2-107-21-233-72.compute-1.amazonaws.com:5432/d4ut0e04d25haa?ssl=true";
var db = pgp(cn);

app.get('/api', (req, res) => {
  res.json ({
    message: "Welcome to Herokku"
  });
});

app.post('/api/contact', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if (err) {
      res.sendStatus(403);
    } else {
      res.json ({
        message: "POST Successful.....",
        authData
      });
    }
  });

  
});

app.post('/api/login', (req, res) => {
  //Mock User
  const user = {
    id:1,
    username:'thanga',
    email:'thanga@gmail.com'
  }

  jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {

    res.json({
      token
    });

  });
  
});

app.get("/", function(req, res) {
  res.send("Herokuuu");
});

app.get("/api/contact", function(req, res) {
  var query = "SELECT * from salesforce.contact";
  db.any(query)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(error) {
      console.log(error);
      res.send(error);
    });
});

app.get("/api/account", function(req, res) {
    var query = "SELECT * from salesforce.account";
    db.any(query)
      .then(function(data) {
        res.send(data);
      })
      .catch(function(error) {
        console.log(error);
        res.send(error);
      });
});

//Format of TOKEN
// Authorization: Bearer <access_token>


//Verify Toekn
function verifyToken (req, res, next) {
  //Get Authorization Header Value
  const bearerHeader = req.headers['authorization'];

  //Check if bearer is undefined 
  if (typeof bearerHeader !== 'undefined') {
    //Split at the space 
    const bearer = bearerHeader.split(' ');

    //Get Access Token from the split array 
    const bearerToken = bearer[1];

    //Set the token
    req.token = bearerToken;

    //Call teh next middleware
    next();

  } else {
    //Forbidden Access
    res.sendStatus(403);
  }

}

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("app listening at %s", port);
});