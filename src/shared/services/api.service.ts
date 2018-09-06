import { Response } from 'express';

export function ok(res: Response, payload: any) {
  res.status(200).send(payload);
}

export function forbidden(res: Response) {
  res.status(403).send('Forbidden');
}

export function serverError(res: Response) {
  res.status(500).send('Internal Server Error');
}
