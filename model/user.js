const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: "Status",
        required: true
    }
})

module.exports = mongoose.model("User", UserSchema);