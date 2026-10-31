// backend/src/services/authService.js
import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/userRepository.js';
import { generateToken } from '../config/jwt.js';
import { validateEmail, validatePassword } from '../utils/validators.js';

class AuthService {
  async register(userData) {
    const { email, username, password, fullName, phoneNumber } = userData;

    // Validation
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 8 characters with letters and numbers');
    }

    // Check existing user
    const existingEmail = await UserRepository.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already registered');
    }

    const existingUsername = await UserRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserRepository.create({
      email,
      username,
      password: hashedPassword,
      fullName,
      phoneNumber,
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    return { user, token };
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId) {
    return UserRepository.findById(userId);
  }

  async updateProfile(userId, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return UserRepository.update(userId, data);
  }
}

export default new AuthService();