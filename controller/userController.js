const User = require("../model/user");

const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const passport = require("passport");

const membershipStatus = {
    one: "ADMIN",
    two: "MEMBER",
    three: "NOT A MEMBER"
}

// Display User sign up form on GET
user_create_get = (req, res, next) => {
    res.render("signup_form", {
        title: "Sign Up"
    })
}

// Display User sign up form on POST
user_create_post = [ 
    // Validate and sanitize form fields
    body("name", "Name must not be empty").trim().isLength({ min: 1}).escape(),
    body("username", "Username must not be empty").trim().isLength({ min: 1}).escape(),
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
                    status: membershipStatus.three,
                })
                // Return to sign up form if errors in validation
                if (!errors.isEmpty()) {
                    res.render("signup_form", {
                        title: "Sign Up",
                        errors: errors.array(),
                        user
                    })
                }
                // Successful
                const result = await user.save();

                req.login(user, function(err) {
                    if (err) { return next(err); }
                    return res.redirect('/');
                });
            } catch(err) {
                return next(err);
            }
        })
}]

module.exports = { user_create_get, user_create_post};