import express, { Router } from "express";
import { shouldBeLoggedIn } from "../controllers/test.auth.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = express.Router();
router.get('/should-be-logged-in', verifyToken, shouldBeLoggedIn);

export default router;