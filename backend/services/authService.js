// authService.js
const User = require('./models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  async registerUser(username, email, password) {
    const user = new User({
      _id: username,
      username,
      email,
      password,
    });
    try {
      await user.save();
      return { message: 'User created successfully' };
    } catch (err) {
      return { error: 'Username or email already exists' };
    }
  }

  async loginUser(username, password) {
    const user = await User.findById(username);
    if (!user) {
      return { error: 'Invalid username or password' };
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return { error: 'Invalid username or password' };
    }
    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    return { token };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded;
    } catch (err) {
      return { error: 'Invalid token' };
    }
  }

  async getUserFromToken(token) {
    const decoded = await this.verifyToken(token);
    if (!decoded) {
      return null;
    }
    return await User.findById(decoded._id);
  }
}

module.exports = new AuthService();