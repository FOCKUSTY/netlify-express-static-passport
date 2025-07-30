import { Env } from 'env';

import connect from 'database/connect';

import express from 'express';
import App from './app';

const app = new App(express(), "api");

connect(Env.env.MONGO_URL);
app.listen();

export { app };
