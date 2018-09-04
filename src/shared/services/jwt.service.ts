// const jwt = require('jsonwebtoken');
import * as jwt from 'jsonwebtoken';
import * as api from './api.service';
import * as userService from './user.service';
import { User } from '../models/user';

const JWT_SECRET = '#$%2i\'m a secret for jwt0012';

export function login(body: any): [number, any] {
  const email = body.username;
  const password = body.password;

  if (!email || !password) {
    return api.forbidden();
  }
  const user = userService.validateUserCredentials(email, password);
  if (!user) {
    return api.forbidden();
  }

  const token = jwt.sign(getUserDetails(user), JWT_SECRET);
  return api.success({ token });
}

function getUserDetails(user: User) {
  const userDetails = Object.assign({}, user);
  delete userDetails.password;
  return userDetails;
}
