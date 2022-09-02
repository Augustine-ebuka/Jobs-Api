const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please provide your name'],
        minlength: 3,
        maxlength: 50,
        //trim: true,
        //some othrt properties that can be passed
        //capitalize: true,
        //lowercase: true,
        //uppercase: true
        //default: 'EBUKA'
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide a valid email address'],
        unique: true,
        //trim: true,
    },
    password: {
        type: String,
        required: [true, 'please provide your password'],
        minlength: 6,
        trim: true,
    },
  /*   socialMediaHandle: {
        type: Map,
        of:String
    } */
    
});
//Pre middleware functions are executed one after another, when each middleware calls next. "save"is important in the middlw
userSchema.pre('save', async function () {
    //method of hashing
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRYTIME })
    //this function only returns the gilbbrish token
}

userSchema.methods.comparePassword = async function (incomingPass) {
    const isMatch = await bcrypt.compare(incomingPass, this.password)
    return isMatch;
}
module.exports = mongoose.model('User', userSchema);

/**
 * datatype for mongoose
 * string
 * boolean
 * date
 * number
 * object
 */
/* schema.pre('save', async () => {
    const hash = bcrypt.genSalt(10);
    this.password = bcrypt.hash(this.password, hash);
})

const { email, password } = req.body;
if (!email && !password) {
    return error
}

if (email == schema.find(email)) {
    
}
schema.create(email, password)
 */