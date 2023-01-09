const { Router } = require("express");
const router = new Router();
const mongoose = require('mongoose');

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


router.get('/signup', isLoggedOut, (req, res) => res.render('auth/signup'));


router.post("/signup", (req, res, next) => {


  const { username, email, password, accountType } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        
        username,
        email,
        passwordHash: hashedPassword,
        accountType,
      });
    })
    .then((user) => {
  
      res.redirect(`user/${user._id}`);
    })
    .catch(error => {
    
      if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render('auth/signup', { errorMessage: error.message });
        } else if (error.code === 11000) {
          res.status(500).render('auth/signup', {
             errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
      } else {
          next(error);
      }
    }) 
});


router.get('/login', (req, res) => res.render('auth/login'));

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;
 
  if (username === "" || email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  if (password.length < 6) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 6 characters long.",
    });
  }
 
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        res.redirect("/");
        
      } else {
      
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
  });
  
        
//         .then((isSamePassword) => {
//           if (!isSamePassword) {
//             res
//               .status(400)
//               .render("auth/login", { errorMessage: "Wrong credentials." });
//             return;
//           }

//           // Add the user object to the session object
//           // req.session.currentUser = user.toObject();
//           // // Remove the password field
//           // delete req.session.currentUser.password;

//           // //app.locals acts like a session but for the views
//           // req.app.locals.user = user.toObject()
//           // delete req.app.locals.user.password;

//           res.redirect("/");
//         })
//         .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
//     })
//     .catch((err) => next(err));
// });

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res) => {
  //req.app.locals.user = false
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("/auth/logout", { errorMessage: err.message });
      return;
    }

    res.redirect("/");
  });
});

//GET - CREATOR
 
router.get("/user/:userId", async (req, res, next) => {
  const {userId} = req.params
  const currentUser = req.session.user
  try {
    const user = await User.findById(userId)
if (user.accountType === "Creator") {
  res.render("creator/new-creator", user)
} else {
  res.render("client/new-client", user)
}
    
  } catch (error) {
    console.log(error);
        next(error)
  }
});

router.post("/creator/:id", async (req, res, next) => {
  try {
    const {firstName, lastName, bio} = req.body;
    const id = req.params.id
    const updatedUser = await User.findByIdAndUpdate(id, {firstName, lastName, bio});
    res.redirect("/auth/login")
  } catch(error) {
    console.log(error);
        next(error)
  }
});

//Get  creator profile

router.get("/profile/:userId", async (req, res, next) => {
  const {userId} = req.params
  const currentUser = req.session.currentUser
  try {
    const user = await User.findById(userId)

if (user.accountType === "Creator") {
  res.render("creator/creator-profile", {user, currentUser, userId})
} else {
  res.render("client/client-profile", {user, currentUser, userId})
}
    
  } catch (error) {
    console.log(error);
        next(error)
  }
});

//Edit creator profile

router.get('/edit/:userId', async (req, res, next) => {
  try {
    const  id  = req.params.userId
    const editCreator = await User.findById(id);

    res.render('/creator/edit', {editCreator})
  }
  catch(error) {
    console.log(error);
    next();
  }
}); 

router.post("/edit/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params
    const {username, firstName, lastName} = req.body 

    const editUser = await User.findByIdAndUpdate(userId, {username, firstName, lastName});
    res.redirect(`/auth/profile/${userId}`);
} catch (error) {
    console.log(error);
    next(error);
}
});




//Get client

router.get("/user/:userId", async (req, res, next) => {
  const {userId} = req.params
  const currentUser = req.session.user
  try {
    const user = await User.findById(userId)
if (user.accountType === "Client") {
  res.render("/client/new-client", user)
} else {
  res.render("/creator/new-creator", user)
}
    
  } catch (error) {
    console.log(error);
        next(error)
  }
});

router.post("/client/:id", async (req, res, next) => {
  try {
    const {firstName, lastName} = req.body;
    const id = req.params.id
    const updatedUser = await User.findByIdAndUpdate(id, {firstName, lastName});
    res.redirect("/auth/login")    
  } catch(error) {
    console.log(error);
        next(error)
  }
});




module.exports = router;