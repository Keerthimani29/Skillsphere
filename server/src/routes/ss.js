const express = require('express');
const { register, loginuser } = require('../controller/ss');
const {getMentorRequests, updateRequestStatus, getMentees, provideFeedback} = require('../controller/faculty');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginuser);

// faculty dashboard
// GET mentor requests for a faculty
router.get('/requests/:facultyId', getMentorRequests);

// PATCH accept/reject a request
router.patch('/requests/:requestId/status', updateRequestStatus);

// GET accepted mentees
router.get('/mentees/:facultyId', getMentees);

// POST feedback
router.post('/feedback/:requestId', provideFeedback);

module.exports = router;
