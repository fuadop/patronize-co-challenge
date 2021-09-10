import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../models';
import sampleResponse from '../utils/response';
const { User } = db;

export const register = async (req, res, next) => {
  try {
    const {
      email,
      name,
      password
    } = req.body;
    
    const userExists = await User.doesUserExist(email);

    if (userExists) {
      throw new Error('User with that email address exists already');
    }

    const user = await User.create({
      email,
      name,
      password,
    });

    // Create user token
    const token = jwt.sign({ ...user.dataValues }, process.env.JWT_SECRET);
    const response = sampleResponse(201, 'Sign up successful', {
      user: {
        ...user.dataValues,
        _id: undefined,
        password: undefined,
        token, 
      }
    });
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const {
      email,
      password,
    } = req.body;
    
    const user = await User.findOne({
      where: {
        email,
      }
    });

    if (!user) {
      throw new Error('No user with attached email found')
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Incorrect password')
    }

    const token = jwt.sign({ ...user.dataValues }, process.env.JWT_SECRET);
    const response = sampleResponse(200, 'Login successful', {
      user: {
        ...user.dataValues,
        _id: undefined,
        password: undefined,
        token
      }
    }); 
    return res.status(response.status).json(response);
  } catch (error) {
    return next(error);
  }
};

