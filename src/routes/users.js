import express from "express";
import { User } from "../controllers";

const router = express.Router();

router.post("/login", User.login);
router.post("/signup", User.signup);
router.get("/verify/:token", User.verify);
router.post("/logout/:user_id", User.logout);

export default router;
