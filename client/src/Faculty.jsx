import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap';
import styles from './Faculty.module.css';

const Faculty = () => {
  const [requests, setRequests] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contactNumber: '',
    department: '',
    designation: '',
    domain: '',
    qualifications: '',
    experience: ''
  });

  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchMentorRequests();
    fetchMentees();
    fetchFacultyProfile();
  }, []);

  const fetchMentorRequests = async () => {
    try {
      const response = await axios.get('/server/reqmentees');
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching mentor requests:', error);
      setRequests([]);
    }
  };

  const fetchMentees = async () => {
    try {
      const response = await axios.get('/server/getmentees');
      setMentees(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching mentees:', error);
      setMentees([]);
    }
  };

  const fetchFacultyProfile = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        console.warn('No userEmail found in localStorage.');
        return;
      }

      const response = await axios.get('/server/faculty/profile', {
        params: { email: userEmail }
      });

      if (response.data && response.data.name) {
        setProfile(response.data);
        setProfileExists(true);
        localStorage.setItem('profileExists', 'true');
      } else {
        setProfileExists(false);
        localStorage.setItem('profileExists', 'false');
      }
    } catch (error) {
      console.error('Error fetching faculty profile:', error);
      setProfileExists(false);
      localStorage.setItem('profileExists', 'false');
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/server/accept/${requestId}`);
      fetchMentorRequests();
      fetchMentees();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`/server/reject/${requestId}`);
      fetchMentorRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post(`/server/feedback/${selectedRequest.id}`, { feedback });
      setShowFeedbackModal(false);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleProfileSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/server/faculty/profile', profile);
      setShowProfileModal(false);
      setProfileExists(true);
      localStorage.setItem('profileExists', 'true');
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  return (
    <Container className={styles.dashboard}>
      <h2>Faculty Dashboard</h2>

      {!profileExists && (
        <Alert variant="warning" className="mt-2">
          Your profile is incomplete. Please fill in your details.
        </Alert>
      )}
      <Button className="mb-3" variant="primary" onClick={() => setShowProfileModal(true)}>
        {profileExists ? 'Edit Profile' : 'Complete Profile'}
      </Button>

      <Card className="mb-4">
        <Card.Header className={styles.cardHeader}>Mentor Requests</Card.Header>
        <ListGroup variant="flush">
          {requests.length === 0 && <ListGroup.Item>No requests available.</ListGroup.Item>}
          {requests.map((req) => (
            <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
              <span>{req.studentName}</span>
              <div>
                <Button variant="success" size="sm" onClick={() => handleAccept(req.id)}>Accept</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleReject(req.id)}>Reject</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <Card>
        <Card.Header className={styles.cardHeader}>My Mentees</Card.Header>
        <ListGroup variant="flush">
          {mentees.length === 0 && <ListGroup.Item>No mentees yet.</ListGroup.Item>}
          {mentees.map((mentee) => (
            <ListGroup.Item key={mentee.id} className="d-flex justify-content-between align-items-center">
              <span>{mentee.name}</span>
              <Button size="sm" variant="info" onClick={() => {
                setSelectedRequest(mentee);
                setShowFeedbackModal(true);
              }}>
                Give Feedback
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>Provide Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="feedbackTextarea">
              <Form.Label>Feedback for {selectedRequest?.name}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleFeedbackSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{profileExists ? 'Edit Your Profile' : 'Complete Your Profile'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {[
              { label: 'Name', key: 'name', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Contact Number', key: 'contactNumber', type: 'text' },
              { label: 'Department', key: 'department', type: 'text' },
              { label: 'Designation', key: 'designation', type: 'text' },
              { label: 'Domain', key: 'domain', type: 'text' },
              { label: 'Qualifications', key: 'qualifications', type: 'text' },
              { label: 'Experience', key: 'experience', type: 'text' },
            ].map(({ label, key, type }) => (
              <Form.Group key={key}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  value={profile[key]}
                  onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleProfileSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Faculty;
