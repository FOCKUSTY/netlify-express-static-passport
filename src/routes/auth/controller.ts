import { Router } from "express";
import passport from "passport";

import Env from "env";

const { env } = Env;

export const router = Router();

router.get('/', passport.authenticate('google'), (req, res) => {
  res.status(200).send(200);
});

router.get('/callback', passport.authenticate('google'), (req, res) => {
  res.redirect(`${env.CLIENT_URL}`);
});

export default router;