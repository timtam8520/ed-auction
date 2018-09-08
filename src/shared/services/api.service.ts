import { Response } from 'express';

export function ok(res: Response, payload = {}) {
  res.status(200).send(payload);
}

export function badRequest(res: Response, msg = 'Bad Request') {
  res.status(404).send(msg);
}

export function unauthorised(res: Response, msg = 'Unauthorised') {
  res.status(401).send(msg);
}

export function forbidden(res: Response) {
  res.status(403).send('Forbidden');
}

export function notFound(res: Response, msg = 'Not Found') {
  res.status(404).send(msg);
}

export function conflict(res: Response, msg = 'Conflit') {
  res.status(409).send(msg);
}

export function serverError(res: Response) {
  res.status(500).send('Internal Server Error');
}
