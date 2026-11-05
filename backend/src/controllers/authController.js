const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await dataStore.findUserByEmail(email);
    if (existingUser) {
      return ApiResponse.error(res, 'An account with this email already exists.', 409);
    }

    const newUser = await dataStore.createUser({
      name,
      email,
      password,
      phone: phone || '',
      role: 'customer'
    });

    const token = generateToken({ id: newUser._id, email: newUser.email, role: newUser.role });

    return ApiResponse.success(res, 'Registration successful. Welcome to RoamReady!', {
      user: newUser,
      token
    }, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userWithPassword = await dataStore.findUserByEmail(email, true);
    if (!userWithPassword) {
      return ApiResponse.error(res, 'Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, userWithPassword.password);
    if (!isMatch) {
      return ApiResponse.error(res, 'Invalid email or password.', 401);
    }

    const { password: _, ...user } = userWithPassword;
    const token = generateToken({ id: user._id, email: user.email, role: user.role });

    return ApiResponse.success(res, 'Login successful.', {
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return ApiResponse.success(res, 'Current user profile', { user: req.user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body;
    const updated = await dataStore.updateUser(req.user._id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(addresses && { addresses })
    });

    return ApiResponse.success(res, 'Profile updated successfully', { user: updated });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const user = await dataStore.findUserById(req.user._id);
    const newAddress = {
      id: `addr_${Date.now()}`,
      ...req.body
    };

    let addresses = user.addresses || [];
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);

    const updated = await dataStore.updateUser(req.user._id, { addresses });
    return ApiResponse.success(res, 'Address added successfully', { addresses: updated.addresses });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  addAddress
};

