const User = require("../model/user");

const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");

// Display User sign up form on GET
// IF user is not LOG IN YET
// Else redirect to homepage
user_create_get = (req, res, next) => {
    if (!res.locals.currentUser) {
        res.render("signup_form", {
            title: "Sign Up",
            user : res.locals.currentUser,
            errors: undefined,
        })
    } else {
        res.redirect('/')
    }

}

// Display User sign up form on POST
user_create_post = [ 
    // Validate and sanitize form fields
    body("name", "Name must not be empty").trim().isLength({ min: 1}).escape(),
    body("username", "Username is required").trim().isLength({ min: 1}).escape()
      .custom(value => {
        return User.findOne({username: value}).then(user => {
            if (user) {
                return Promise.reject('Username already in use. Please use another.')
            }
        })
      }),
    body("password", "Password must not be empty").trim().isLength({ min: 1}).escape(),
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
                    status: process.env.MEMBER_THREE,
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

module.exports = { user_create_get, user_create_post, user_logout_get};