const Message = require('../model/message');

// Display Message Create form on GET
message_create_get = (req, res, next) => {
    if (res.locals.currentUser) {
        res.render("message_form", {
            title: "Create New Message",
            user : res.locals.currentUser,
            errors: undefined,
        })
    } else {
        res.redirect('/')
    }
}

module.exports = {message_create_get}