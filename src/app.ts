import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import cors from 'cors';
import routes from './routes';
import AppError from './errors/AppError';

import createConnection from './database';

createConnection();
const app = express();

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

app.use(express.json());
app.use(logRequests);
app.use(cors);
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
