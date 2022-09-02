const express = require('express');
const router = express.Router();

const { getAlljobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobs')

router.route('/').get(getAlljobs);
router.route('/').post(createJob);
router.route('/:id').get(getJob);
router.route('/:id').patch(updateJob);
router.route('/:id').delete(deleteJob);

module.exports = router;