module.exports = (req, res, next) => {
    // checks if the user is a client
    if (!req.session.currentUser) {
      return res.redirect("/");
    }
 
    next();
  };