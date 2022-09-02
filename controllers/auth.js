const userAuth = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')
//const bcrypt = require('bcrypt');

//REGISTER IMPLEMENTATION
const register = async (req, res) => {
    const user = await userAuth.create({ ...req.body });
    //just immediatetly the user is enter, we will create the token
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
//LOGIN IMPLEMENTATION
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Invalid email or password');
    }
   //CHECK IF USER EXIST IN THE DATABASE OR NOT, then bring out the document of this person
    const user = await userAuth.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('invalid credentials in the database');
    }
    //alternative implementation
   /*  const passComp = async (incom) => {
        const pass = user.password;
        const comapre = bcrypt.compare(incom, user.password);
        return comapre
    } */
    //Dehashing...
    const comparePass = await user.comparePassword(password);
    if (!comparePass) {
        throw new UnauthenticatedError('invalid credentials');
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}


module.exports = {
    register,
    login
}

