const mongoose = require('mongoose');

jobSchema = new mongoose.Schema({
    company: {
        type: 'String',
        required: [true, 'please provide Company name'],
        maxLength: 50
    },
    position: {
        type: 'String',
        required: [true, 'please provide position name'],
        maxLength: 50
    },
    status: {
        type: 'String',
        enum:['interview', 'declined', 'pending'],
       default: 'pending',
  
    },
    createdBy: {
        type: mongoose.Types.ObjectId,//this allow us to tie anyjob created to our User model
        ref: 'User',// model we are referncing which is our User model.
        required: [true, 'Please provide user'],
    },
},
    { timestamps: true }
)


module.exports = mongoose.model('Job', jobSchema);