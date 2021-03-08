import express from "express";
import users from "./users";
import blogRoutes from "./blog.route";

const router = express.Router();

router.use("/api/users", users);
router.use("/api/blog", blogRoutes);

export default router;
