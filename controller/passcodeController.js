const { body, validationResult } = require("express-validator");
const User = require("../model/user");

passcode_enter_get = (req, res, next) => {
  // Provide passcode when user is not yet a member
  if (!res.locals.currentUser.membership_status) {
    res.render("passcode", {
      title: "Passcode",
      user: res.locals.currentUser,
      errors: undefined,
      passcodeErr: undefined,
    });
  } else {
    res.redirect("/");
  }
};

passcode_enter_post = [
  // Process entered passcode from user
  // Validate and sanitize form fields
  body("passcode")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please enter the passcode")
    .escape()
    .custom((value) => {
      if (
        value !== process.env.PASSCODE_MEMBER &&
        value !== process.env.PASSCODE_ADMIN
      ) {
        throw new Error("Passcode is incorrect!");
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Render form again
      res.render("passcode", {
        title: "Passcode",
        user: res.locals.currentUser,
        errors: undefined,
        passcodeErr: errors.mapped(),
      });
      return;
    } else {
      if (req.body.passcode === process.env.PASSCODE_MEMBER) {
        // Set user membership status to MEMBER
        const filter = { username: res.locals.currentUser.username };
        const update = { membership_status: true };

        const user = await User.findOneAndUpdate(filter, update, {
          new: true,
        });

        // Redirect to homepage after setting status
        res.redirect("/");
      } else if (req.body.passcode === process.env.PASSCODE_ADMIN) {
        // Set user membership status to ADMIN
        const filter = { username: res.locals.currentUser.username };
        const update = { membership_status: true, isAdmin: true };

        const user = await User.findOneAndUpdate(filter, update, {
          new: true,
        });

        // Redirect to homepage after setting status
        res.redirect("/");
      }
    }
  },
];

module.exports = { passcode_enter_get, passcode_enter_post };
