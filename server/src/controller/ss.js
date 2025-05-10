const {login , metorRequest} = require('../model/ss');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await login.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const user = new login({ username, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginuser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const user = await login.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or role' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, loginuser };
