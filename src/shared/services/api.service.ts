import { Response } from 'express';

export function ok(res: Response, payload: any) {
  res.status(200).send(payload);
}

export function unauthorised(res: Response, msg = 'Unauthorised') {
  res.status(401).send(msg);
}

export function forbidden(res: Response) {
  res.status(403).send('Forbidden');
}

export function serverError(res: Response) {
  res.status(500).send('Internal Server Error');
}
