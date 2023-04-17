const User = require("../model/user");

const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Display User sign up form on GET
// IF user is not LOG IN YET
// Else redirect to homepage
user_create_get = (req, res, next) => {
    if (!res.locals.currentUser) {
        res.render("signup_form", {
            title: "Sign Up",
            user : undefined,
            errors: undefined,
        })
    } else {
        res.redirect('/')
    }
}

// Process sign up form on POST
user_create_post = [ 
    // Validate and sanitize form fields
    body("name")
      .trim()
      .isLength({ min: 1})
      .withMessage("Name must not be empty")
      .isAlpha()
      .withMessage("Name must only consists of letters!")
      .escape(),
    body("username", "Username is required").trim().isLength({ min: 1}).escape()
      .custom(value => {
        return User.findOne({username: value}).then(user => {
            if (user) {
                return Promise.reject('Username already in use. Please use another.')
            }
        })
      }),
    body("password")
      .trim()
      .not().isEmpty()
      .withMessage("Password must not be empty")
    //   .isLength({ min: 8})
      .withMessage("Password must be at least 8 characters long (e.g., Good143! or welcome155).")
      .escape(),
    body("confirm_password", "Please confirm your password").trim().isLength({ min: 1}).escape()
     .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    
    // Process request after validation and sanitization
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err)
            }
            try {
                // Create user object from the sanitized data
                const user = new User({
                    name: req.body.name,
                    username: req.body.username,
                    password: hashedPassword,
                    membership_status: false,
                    isAdmin: false,
                })
                // Return to sign up form if errors in validation
                if (!errors.isEmpty()) {
                    res.render("signup_form", {
                        title: "Sign Up",
                        errors: errors.mapped(),
                        user
                    })
                    // Important to return to prevent Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client!!!
                    return;
                } else {
                    // Successful
                    const result = await user.save();

                    // Automatically LOG IN user upon sign up
                    req.login(user, function(err) {
                        if (err) { return next(err); }
                        return res.redirect('/');
                    });
                }

            } catch(err) {
                return next(err);
            }
        })
}];

// LOG OUT user on GET request
user_logout_get = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
};

// Display User LOGIN form on GET
// IF user is already LOG IN 
// Else redirect to homepage
user_login_get = (req, res, next) => {
    if (!res.locals.currentUser) {
        res.render("login_form", {
            title: "Log in",
            username : undefined,
            user: undefined,
            errors: undefined,
            username_err: res.locals.username_err,
            password_err: res.locals.password_err
        })
    } else {
        res.redirect('/')
    }
}

// Process login form on POST
user_login_post = [ 
    // Validate and sanitize form fields
    body("username", "Username is required").trim().isLength({ min: 1}).escape(),
    body("password", "Password must not be empty").trim().isLength({ min: 1}).escape(),

    // Process request after validation and sanitization
    (req, res, next) => {
        // Extract the validation errors from request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('login_form', {
                title: "Log in",
                username : req.body.username,
                user: undefined,
                errors: errors.mapped(),
            })
            return;
        }
        
        console.log(res.locals.messages);
        // if validation is successful, call next() to go on with passport authentication.
        next();
    },
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/log-in',
        failureFlash: true
    })
];

module.exports = { user_create_get, user_create_post, user_logout_get, user_login_get, user_login_post};