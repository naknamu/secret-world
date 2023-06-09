const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxLength: 100,
  },
  date_posted: {
    type: Date,
    default: Date.now,
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxLength: 500,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps : true});

MessageSchema.virtual("date_posted_formatted").get(function () {
  return this.date_posted.toLocaleString('en-US', {timeZone: 'America/New_York' , dateStyle: 'full',timeStyle: 'short',});
});


module.exports = mongoose.model("Message", MessageSchema);
