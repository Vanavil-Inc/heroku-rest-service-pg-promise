var express = require("express");
var app = express();
var pgp = require("pg-promise")();

var cn =
  "postgres://tghowiiwbpkukb:26c4126838e723431a8a6a3dac211499d3eb54da7f47892f71128ba21f5b610a@ec2-107-21-233-72.compute-1.amazonaws.com:5432/d4ut0e04d25haa?ssl=true";
var db = pgp(cn);

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

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("app listening at %s", port);
});