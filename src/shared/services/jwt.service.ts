import fs from 'fs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as api from './api.service';
import { validateUserCredentials } from './user.service';
import { User } from '../models/user';

import { Request, Response, NextFunction } from 'express';

dotenv.config({ path: 'environments/.env' });
const CERT_DIR = process.env.CERT_DIR;

const privateCert = fs.readFileSync(`${CERT_DIR}\\id_rsa_ed-auction-api`, 'utf-8');
const publicCert = fs.readFileSync(`${CERT_DIR}\\id_rsa_ed-auction-api.pub`, 'utf-8');

const AUTHDATA = 'authData';

export function login(req: Request, res: Response) {
  try {
    const body = req.body;

    const email = body.username;
    const password = body.password;

    if (!email || !password) {
      return api.forbidden(res);
    }
    const user = validateUserCredentials(email, password);
    if (!user) {
      return api.unauthorised(res, 'Incorrect username or password');
    }

    const token = jwt.sign(getUserDetails(user), privateCert, { algorithm: 'RS256' });
    return api.ok(res, { token });
  } catch (err) {
    console.error(err);
    return api.internalServerError(res);
  }
}

function getUserDetails(user: User) {
  const userDetails = Object.assign({}, user);
  delete userDetails.password;
  return userDetails;
}

export function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers['authorization'];
    if (authorization == null) {
      return api.forbidden(res);
    } else {
      // token: Bearer xxxx
      const bearerToken = authorization.split(' ');
      const token = bearerToken[1];
      let authData = null;
      try {
        authData = jwt.verify(token, publicCert, { algorithms: ['RS256'] });
        (<any>req)[AUTHDATA] = authData;
        next();
      } catch (err) {
        console.error(err);
        return api.forbidden(res);
      }
    }
  } catch (err) {
    console.error(err);
    return api.internalServerError(res);
  }
}

export function getUserId(req: Request) {
  try {
    const authData = (<any>req)[AUTHDATA];
    const userId = authData.userId;
    return userId;
  } catch (err) {
    console.error('Could not get user id from request');
    throw err;
  }
}
