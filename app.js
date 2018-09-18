var express = require("express");
var app = express();
var pgp = require("pg-promise")();
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

var expressValidator = require("express-validator");
// var expressSession = require("express-session");
app.use(expressValidator());
// app.use(expressSession());


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
      // res.json ({
      //   message: "POST Successful.....",
      //   authData
      // });
      console.log(req.body);
      const name = req.body.name;
      const phone = req.body.phone;
      const salutation = req.body.salutation;
      const title = req.body.title;
      const createdbyid = req.body.createdbyid;
      console.log(name, phone, salutation, title, createdbyid);
      db.one(
        "INSERT INTO salesforce.contact(name, phone, salutation, title, createdbyid) VALUES($1, $2,$3, $4,$5) RETURNING id",
        [name, phone, salutation, title, createdbyid]
      )
        .then(data => {
          console.log(data);
          let dataObj = {};
          dataObj["message"] = "Row inserted successfully";
          dataObj["rowId"] = data.id;
          res.send(dataObj);
        })
        .catch(error => {
          console.log(error);
          res.send(error);
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
  jwt.sign({user}, 'secretkey', { expiresIn: '2d' }, (err, token) => {
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

app.get("/api/contact/:id", function(req, res) {
  var id = req.params.id;
  console.log(id);
  db.one("SELECT * FROM salesforce.contact WHERE id = $1", id)
    .then(user => {
      console.log(user);
      res.send(user);
    })
    .catch(error => {
      console.log(error);
      res.send(error.message);
    });
});

//PUT call to UPDATE contact table

app.put("/api/contact/:id", function(req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if (err) {
        res.sendStatus(403);
    } else {
        console.log(req.body);
        const name = req.body.name;
        const phone = req.body.phone;
        const salutation = req.body.salutation;
        const title = req.body.title;
        console.log(name, phone, salutation, title);
        db.none(
          "update salesforce.contact set name=$1, phone=$2, salutation=$3, title=$4 where id=$5",
          [name, phone, salutation, title, parseInt(req.params.id)]
        )
          .then(data => {
            res.status(200).json({
              status: "success",
              message: "Updated contact"
            });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
    }
  });
});

//DELETE call to delete a row based on the "id"
app.delete("/api/contact/:id", function(req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if (err) {
      res.sendStatus(403);
    } else {
      var id = req.params.id;
      console.log(id);
      db.result("DELETE FROM salesforce.contact WHERE id = $1", id)
        .then(result => {
          res.status(200).json({
            status: "success",
            message: `Removed ${result.rowCount} contact`
          });
        })
        .catch(error => {
          console.log(error);
          res.send(error.message);
        });
      }
  });
});


app.post('/api/account', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if (err) {
      res.sendStatus(403);
    } else {
      // res.json ({
      //   message: "POST Successful.....",
      //   authData
      // });
      console.log(req.body);
      const name = req.body.name;
      const phone = req.body.phone;
      const salutation = req.body.salutation;
      const title = req.body.title;
      const createdbyid = req.body.createdbyid;
      console.log(name, phone, salutation, title, createdbyid);
      db.one(
        "INSERT INTO salesforce.account(name, phone, salutation, title, createdbyid) VALUES($1, $2,$3, $4,$5) RETURNING id",
        [name, phone, salutation, title, createdbyid]
      )
        .then(data => {
          console.log(data);
          let dataObj = {};
          dataObj["message"] = "Row inserted successfully";
          dataObj["rowId"] = data.id;
          res.send(dataObj);
        })
        .catch(error => {
          console.log(error);
          res.send(error);
        });
    }
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

app.get("/api/account/:id", function(req, res) {
  var id = req.params.id;
  console.log(id);
  db.one("SELECT * FROM salesforce.account WHERE id = $1", id)
    .then(user => {
      console.log(user);
      res.send(user);
    })
    .catch(error => {
      console.log(error);
      res.send(error.message);
    });
});
app.put("/api/account/:id", function(req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if (err) {
        res.sendStatus(403);
    } else {
        console.log(req.body);
        const name = req.body.name;
        const phone = req.body.phone;
        const salutation = req.body.salutation;
        const title = req.body.title;
        console.log(name, phone, salutation, title);
        db.none(
          "update salesforce.account set name=$1, phone=$2, salutation=$3, title=$4 where id=$5",
          [name, phone, salutation, title, parseInt(req.params.id)]
        )
          .then(data => {
            res.status(200).json({
              status: "success",
              message: "Updated account"
            });
          })
          .catch(error => {
            console.log(error);
            res.send(error);
          });
    }
  });
});

app.delete("/api/account/:id", function(req, res) {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if (err) {
      res.sendStatus(403);
    } else {
      var id = req.params.id;
      console.log(id);
      db.result("DELETE FROM salesforce.account WHERE id = $1", id)
        .then(result => {
          res.status(200).json({
            status: "success",
            message: `Removed ${result.rowCount} account`
          });
        })
        .catch(error => {
          console.log(error);
          res.send(error.message);
        });
      }
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