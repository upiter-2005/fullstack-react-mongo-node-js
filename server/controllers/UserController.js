import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret77',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...data } = user._doc;
    res.json({
      ...data,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Не удалось(',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: 'Not found user!' });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(403).json({ message: 'Password is not correct!' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret77',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...data } = user._doc;
    res.json({
      ...data,
      token,
    });
  } catch (err) {
    res.status(400).json({
      message: 'Не удалось войти(',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...data } = user._doc;
    res.json({
      ...data,
    });

    //res.json({ message: 'Me success' });
  } catch (err) {
    res.status(500).json({
      message: 'Not token exist',
    });
  }
};
