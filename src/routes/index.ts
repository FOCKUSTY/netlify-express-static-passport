import { Router } from 'express';

import auth from "./auth"

const router = Router();

router.use("/auth", auth);

export { router };

export default router;
