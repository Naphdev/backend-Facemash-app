const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.singup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  
  const avatar_img = req.body.avatar_img;
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const userDetails = {
      avatar_img: avatar_img,
      name: name,
      email: email,
      password: hashedPassword,
      actype: 'user' // เพิ่ม actype
    };
    await User.saveUser(userDetails);
    res.status(201).json({ message: 'successfully registered' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      'secretfortoken',
      { expiresIn: '1h' }
    );
    res.status(200).json({
      token: token,
      userId: user._id,
      actype: user.actype,
      message: 'login successfully'
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const users = await User.getCurrentUser();
    res.status(200).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.checkToken = async (req, res) => {
  return res.status(200).json({ message: "true" });
};

exports.getUsedetail = async (req, res, next) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByUserId(userId);
    if (!user) {
      const error = new Error('A user with this ID could not be found.');
      error.statusCode = 401;
      throw error;
    }
    res.status(200).json({
      _id: user._id,
      avatar_img: user.avatar_img,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getaccount = async (req, res, next) => {
  try {
    const allac = await User.getAccount();
    res.status(200).json(allac);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  const userId = req.body.userId;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  try {
    const user = await User.findByUserId(userId);
    if (!user) {
      const error = new Error('A user with this ID could not be found.');
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isEqual) {
      const error = new Error('Old password is incorrect.');
      error.statusCode = 401;
      throw error;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await User.updatePassword(userId, hashedNewPassword);
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeName = async (req, res, next) => {
  const userId = req.body.userId;
  const newName = req.body.newName;
  try {
    await User.updateName(userId, newName);
    res.status(200).json({ message: 'Name changed successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changeAvatar = async (req, res, next) => {
  const userId = req.body.userId;
  const newAvatarImg = req.body.newAvatarImg;
  try {
    await User.updateAvatar(userId, newAvatarImg);
    res.status(200).json({ message: 'Avatar image changed successfully.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAccountById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const account = await User.getAccountById(userId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(200).json(account);
  } catch (err) {
    console.error("Error retrieving account:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


