import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';  // Scoped CSS module

const Login = () => {
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleChange = (val) => {
    setRole(val);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/server/login', {
      username,
      password,
      role,
    });

    const { token, role: userRole } = response.data;

    alert(`Login successful as ${userRole}`);
    localStorage.setItem('token', token);

    // Navigate based on role
    if (userRole === 'faculty') {
      navigate('/faculty');
    } else if (userRole === 'student') {
      navigate('/student');
    } else {
      alert('Unknown role. Please contact support.');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Login failed');
  }
};


  return (
    <Container className={`${styles.container} d-flex justify-content-center align-items-center`}>
      <Card className={`${styles.card} p-4 shadow`}>
        <h3 className="text-center mb-4">Skillsphere</h3>
        <ToggleButtonGroup
          type="radio"
          name="role"
          value={role}
          onChange={handleRoleChange}
          className="mb-4 d-flex justify-content-center"
        >
          <ToggleButton
            id="student"
            className={styles.toggleButton}
            value="student"
            variant={role === 'student' ? 'primary' : 'outline-primary'}
          >
            Student
          </ToggleButton>
          <ToggleButton
            id="faculty"
            className={styles.toggleButton}
            value="faculty"
            variant={role === 'faculty' ? 'primary' : 'outline-primary'}
          >
            Faculty
          </ToggleButton>
        </ToggleButtonGroup>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>{role === 'student' ? 'Student Username' : 'Faculty Username'}</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="text"
              placeholder={`Enter ${role} username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className={styles.formControl}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button className={`${styles.loginButton} w-100`} type="submit">
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        </Form>

        <div className={`text-center ${styles.linkText}`}>
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
