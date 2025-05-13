const express = require('express');
const { register, loginuser } = require('../controller/ss');
const {getMentorRequests, updateRequestStatus, getMentees, provideFeedback , createOrUpdateFacultyProfile , getFacultyProfile} = require('../controller/faculty');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginuser);

// faculty dashboard

//facutly profile
router.post('/faculty/profile', createOrUpdateFacultyProfile);
router.get('/faculty/profile', getFacultyProfile);

// GET mentor requests for a faculty
router.get('/reqmentees/:facultyId', getMentorRequests);

// PATCH accept/reject a request
router.patch('/requests/:requestId/status', updateRequestStatus);

// GET accepted mentees
router.get('/getmentees/:facultyId', getMentees);

// POST feedback
router.post('/feedback/:requestId', provideFeedback);

module.exports = router;
