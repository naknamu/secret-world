const { body, validationResult } = require('express-validator');
const User = require('../model/user');

passcode_enter_get = (req, res, next) => {
    // Provide passcode when user is LOGin
    if (res.locals.currentUser) {
        res.render('passcode', { 
            title: 'Passcode',
            user: res.locals.currentUser,
            errors: undefined,
            passcodeErr: undefined
          });
    } else {
        res.redirect('/');
    }
}

passcode_enter_post = [
    // Process entered passcode from user
    // Validate and sanitize form fields
    body("passcode", "Please enter the passcode").trim().isLength({ min: 1}).escape(),

    async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Render form again
            res.render('passcode', { 
                title: 'Passcode',
                user: res.locals.currentUser,
                errors: undefined,
                passcodeErr: errors.mapped(),
            });
            return;
        } else {
            if (req.body.passcode === process.env.PASSCODE_MEMBER) {

                // Set user membership status to MEMBER
                const filter = {username: res.locals.currentUser.username};
                const update = {status: "MEMBER"};
                
                const user = await User.findOneAndUpdate(filter, update);

                // Redirect to homepage after setting status
                res.redirect("/");
            }
        }

}]

module.exports = {passcode_enter_get, passcode_enter_post}