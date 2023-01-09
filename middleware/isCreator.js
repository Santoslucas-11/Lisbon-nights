
module.exports = (req, res, next) => {
  // checks if the user is a event creator
  if (req.session.currentUser.accountType !== "Creator") {
    
    return res.redirect("/");
  }
  //If it's a collector, goes to next
  next()
};