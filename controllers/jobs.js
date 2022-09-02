const Job = require("../models/Job");
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors');

//get all jobs for a particular user
const getAlljobs = async (req, res) => {
    //jobs assoicited with a particular user
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.CREATED).json({jobs,len: jobs.length});
}
//get one job for one user
const getJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const singleJob = await Job.findOne({
        _id: jobId,
        createdBy: userId,
    
    })
    if (!singleJob) {
        throw new NotFoundError('job not found');
    }
    res.status(StatusCodes.OK).json({singleJob})
}
//create job for a particular user
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)
    res.status(201).json({ job })
}
//update job for a particular user
const updateJob = async (req, res) => { 
    const {
        body:{company,position},
        user: { userId },
        params: { id: jobId } } = req;
    
    if (company === '' || position === '') { 
        throw new BadRequestError("company or position can not be empty");
    }
    const patchJob = await Job.findByIdAndUpdate(
        {
        _id: jobId,
        createdBy: userId
        },
        req.body,
        { new: true, runValidators: true });
    if (!patchJob) { 
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({patchJob});
}
//delete job for a particular user
const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const deleteJob = await Job.findByIdAndRemove({ _id: jobId,createdBy: userId });
    if (!deleteJob) { 
        throw new NotFoundError(`No job with id ${jobId}`);
    }
    res.status(StatusCodes.OK).json({Msg: 'Job deleted successfully'});
}

module.exports = { getAlljobs, getJob, createJob, updateJob, deleteJob };
