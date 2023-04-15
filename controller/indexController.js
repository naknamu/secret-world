const Message = require('../model/message')

exports.index_get = async (req, res, next) => {

    const messages = await Message.find()
      .sort({date_posted: -1})
      .populate("user")
      .exec();

    res.render('index', { 
        title: 'Home',
        user: res.locals.currentUser,
        errors: undefined,
        messages
    });
}