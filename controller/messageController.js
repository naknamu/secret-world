const Message = require("../model/message");

const { body, validationResult } = require("express-validator");

// Display Message Create form on GET
message_create_get = (req, res, next) => {
  if (res.locals.currentUser) {
    res.render("message_form", {
      title: "Create New Message",
      user: res.locals.currentUser,
      errors: undefined,
      message: undefined,
    });
  } else {
    res.redirect("/");
  }
};

// Process message form on POST
message_create_post = [
  // Validate and sanitize form fields
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("message")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Your message is required")
    .isLength({ max: 300 })
    .withMessage("You exceeded the maximum characters allowed which is 300")
    .escape(),

  // Process request after validation and sanitization
  async (req, res, next) => {
    // Extract the validation errors from request
    const errors = validationResult(req);

    // Create message object from submitted form
    const message = new Message({
      title: req.body.title,
      date_posted: new Date(),
      message: req.body.message,
      user: res.locals.currentUser,
    });

    if (!errors.isEmpty()) {
      res.render("message_form", {
        title: "Create New Message",
        user: res.locals.currentUser,
        errors: errors.mapped(),
        message,
      });
      return;
    } else {
      // Successful
      const result = await message.save();

      res.redirect("/");
    }
  },
];

module.exports = { message_create_get, message_create_post };
