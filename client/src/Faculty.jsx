import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, ListGroup, Modal, Form } from 'react-bootstrap';
import styles from './Faculty.module.css';

const Faculty = () => {
  const [requests, setRequests] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchMentorRequests();
    fetchMentees();
  }, []);

  const fetchMentorRequests = async () => {
  try {
    const response = await axios.get('/server/reqmentees');
    console.log('Mentor request response:', response.data); // Debug line
    // Ensure response.data is an array
    setRequests(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching mentor requests:', error);
    setRequests([]); // Reset on error
  }
};


  const fetchMentees = async () => {
  try {
    const response = await axios.get('/server/getmentees');
    // Always set mentees as an array
    setMentees(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error('Error fetching mentees:', error);
    setMentees([]); // Reset mentees to an empty array on error
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
      setShowModal(false);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Container className={styles.dashboard}>
      <h2>Faculty Dashboard</h2>

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
    {Array.isArray(mentees) && mentees.length === 0 && <ListGroup.Item>No mentees yet.</ListGroup.Item>}
    {Array.isArray(mentees) && mentees.map((mentee) => (
      <ListGroup.Item key={mentee.id} className="d-flex justify-content-between align-items-center">
        <span>{mentee.name}</span>
        <Button size="sm" variant="info" onClick={() => {
          setSelectedRequest(mentee);
          setShowModal(true);
        }}>
          Give Feedback
        </Button>
      </ListGroup.Item>
    ))}
  </ListGroup>
</Card>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleFeedbackSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Faculty;
