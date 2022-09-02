const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');


const errorHandlerMiddleware = (err, req, res, next) => {
  let CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message || "try again later, something went wrong",
  }
  if (err instanceof CustomAPIError) {  
    return res.status(err.statusCode).json({ msg: err.message })
  }
  //The Object.values() method returns
  // an array of a given object's own enumerable property
  //values, in the same order as that provided by a for...in loop.
  //(The only difference is that a for...in loop enumerates properties in the prototype chain as well.)
  if (err.name === 'ValidatorError') {
    CustomError.msg = Object.values(err.errors).map((item) => item.message).join(', ');
    CustomError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    CustomError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} or User already exist field, please choose another value`
    CustomError.statusCode = 400
  }
  if (err.name === 'CastError') {
    CustomError.msg = `no item found with id ${err.value}`;
    CustomError.statusCode = 404;
    
  }
  //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(CustomError.statusCode).json({msg:CustomError.msg})

}

module.exports = errorHandlerMiddleware
