const {login , mentorRequest , faculty} = require('../model/ss');

const createOrUpdateFacultyProfile = async (req, res) => {
  const { name, email, contactNumber, department, designation, domain, qualifications, experience } = req.body;

  const existingProfile = await faculty.findOne({ email });
  if (existingProfile) {                
    // Update existing profile
    existingProfile.name = name;
    existingProfile.contactNumber = contactNumber;
    existingProfile.department = department;
    existingProfile.designation = designation;
    existingProfile.domain = domain;
    existingProfile.qualifications = qualifications;
    existingProfile.experience = experience;

    await existingProfile.save();
  }
  else {
    // Create new profile
    const newProfile = new faculty({
      name,
      email,
      contactNumber,
      department,
      designation,
      domain,
      qualifications,
      experience
    });

    await newProfile.save();
  }
  res.json({ message: 'Profile created/updated successfully' });
}

const getFacultyProfile = async (req, res) => {
  const { email } = req.query;
  const profile = await faculty.findOne({ email });     
  if (!profile) { 
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
};


const getMentorRequests = async (req, res) => {
  const { facultyId } = req.params;
  const requests = await mentorRequest.find({ facultyId }).populate('studentId', 'username');
  res.json(requests);
};

const updateRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const request = await mentorRequest.findByIdAndUpdate(
    requestId,
    { status },
    { new: true }
  );

  res.json({ message: `Request ${status}` });
};

const getMentees = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const mentees = await mentorRequest.find({ facultyId, status: 'accepted' }).populate('studentId', 'username');
    res.json(mentees);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
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
  provideFeedback,
  createOrUpdateFacultyProfile,
  getFacultyProfile
};
