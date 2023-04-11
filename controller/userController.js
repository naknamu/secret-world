const User = require("../model/user");

// Display User sign up form on GET
user_create_get = (req, res, next) => {
    res.render("signup_form", {
        title: "Sign Up"
    })
}

// Display User sign up form on POST
user_create_post = (req, res, next) => {
    res.send("NOT IMPLEMENTED: Sign up form POST");
}

module.exports = { user_create_get, user_create_post};