const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: String,
    password: String,
    email: {
        type:String,
        required:true,
        unique:true,
        // validate:{
        //     validator: (v) => validator.isEmail(v),
        //     message: props => `${props.value}は正しいメールアドレスではありません。`
        // }
    },
    image: String,
})

module.exports = mongoose.model('User', UserSchema);