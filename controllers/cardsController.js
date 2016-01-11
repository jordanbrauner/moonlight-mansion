var express = require("express");
var router = express.Router();
var Card = require("../models/card");

function error(response, message) {
  response.status(500);
  response.json({error: message});
}

router.get("/", function(req, res) {
  Card.find({}).then(function(results) {
    // console.log(results);
    res.json(results);
  });
});

module.exports = router;
