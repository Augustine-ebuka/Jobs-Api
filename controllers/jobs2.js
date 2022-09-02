const {StatusCodes} = require('http-status-codes');
const jobModel = require('../models/Job')
const {BadRequestError, NotFoundError} = require('../errors')

const creatJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await jobModel.create(req.body)
    if (!job) {
       throw new BadRequestError('unable to create the job')
    }
    res.status(StatusCodes.CREATED).json({ job})
}
const getAllJob = async (req, res) => {
    const { user: userId } = req;
    const job = await jobModel
        .find({ createdBy: userId })
        .select({ company, position })
    if (!job) { 
        throw new NotFoundError(`Job not found`);
    }
    res.status(StatusCodes.OK).json({ job });
}
const getOneJob = async (req, res) => {
    const {user: userId,params: { id: jobId }} = req;
    const job = await jobModel.findone({
        _id: jobId,
        createdBy: userId
    }).select({ company, position })
    if (!job) { 
        throw new NotFoundError(`Job not found for a particular userId ${userId}`);
    }
    res.status(StatusCodes.OK).json({ job });
    
}
const updateOneJob = async (req, res) => {
    const {
        user: userId,
        params: { id: jobId },
        body: { company, position } } = req;
    if (company == null || position == null) {
        throw new BadRequestError('please insert data');
    }
    
    const job = await jobModel.findByIdAndUpdate(
    {
        _id: jobId,
        createdBy: userId
},
        req.body,
    {
        new: true,
        runValidators: true
    });
    if (!job) { 
        throw new NotFoundError(`No Job to update  ${userId}`);
    }

    res.status(StatusCodes.OK).json({ job });
}
const DeleteOneJob = async (req, res) => {
    const { user: userId, params: { id: jobId } } = req;
    const job = await jobModel.findOneAndRemove({ _id: jobId, createdBy: userId });
    if (!job) { 
        throw new NotFoundError(`No Job to delete  ${userId}`);
    }

    res.status(StatusCodes.OK).json({ msg:"job deleted successfully" });
}

module.exports = { creatJob, getAllJob, getOneJob, updateOneJob, DeleteOneJob };
