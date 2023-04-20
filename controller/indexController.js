const Message = require("../model/message");

index_get = async (req, res, next) => {
  const messages = await Message.find()
    .sort({ date_posted: -1 })
    .populate("user")
    .exec();

    console.log("Timezone offset: " + new Date().getTimezoneOffset());

  res.render("index", {
    title: "Home",
    user: res.locals.currentUser,
    errors: undefined,
    messages
  });
};

message_delete_post = async (req, res, next) => {
  // Delete message through the message id
  await Message.findByIdAndRemove(req.body.message_id);
  // Redirect to homepage
  res.redirect("/");
};

module.exports = { index_get, message_delete_post };
