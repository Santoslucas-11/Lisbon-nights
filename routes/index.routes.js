const express = require('express');
const router = express.Router();
const User = require("../models/User.model");


/* GET home page */
router.get("/", (req, res, next) => {
  const currentUser = req.session.currentUser
  if(!currentUser) {
    res.render("index");
  } else {
    const currentUser = req.session.currentUser
    const user = User.find()
    const creator = req.session.currentUser.accountType === "Creator"
    res.render("index", {currentUser, creator, user});
  }
});



module.exports = router;