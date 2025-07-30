import { Env } from "services/env";

import express from "express";
import serverless from "serverless-http";

import connect from "database/connect";
import router from "routes";

const app = express();

app.use("/", router);
app.use("/.netlify/functions/app/", router);

connect(Env.env.MONGO_URL);

export const handler = serverless(app);