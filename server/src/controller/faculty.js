const {login , mentorRequest} = require('../model/ss');


const getMentorRequests = async (req, res) => {
  const { facultyId } = req.params;
  const requests = await mentorRequest.find({ facultyId }).populate('studentId', 'username');
  res.json(requests);
};

const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await MIDIConnectionEvententorRequest.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );

  res.json({ message: `Request ${status}` });
};

const getMentees = async (req, res) => {
  const { facultyId } = req.params;
  const mentees = await mentorRequest.find({ facultyId, status: 'accepted' }).populate('studentId', 'username');
  res.json(mentees);
};

const provideFeedback = async (req, res) => {
  const { requestId } = req.params;
  const { feedback } = req.body;

  const updated = await mentorRequest.findByIdAndUpdate(
    requestId,
    { feedback },
    { new: true }
  );

  res.json({ message: 'Feedback submitted' });
};

module.exports = {
  getMentorRequests,
  updateRequestStatus,
  getMentees,
  provideFeedback
};
