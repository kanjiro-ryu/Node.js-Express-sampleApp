const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TweetSchema = new Schema({
    user:
        { type:Schema.Types.ObjectId, ref:'User'}
    ,
    content: String
})

module.exports = mongoose.model('Tweet', TweetSchema);