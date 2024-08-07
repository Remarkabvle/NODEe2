import BlogsController from "../controller/blog.js";
import UsersController from "../controller/user.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";
import { auth } from "../middleware/auth.js";
import { ownerMiddleware } from "../middleware/owner-middleware.js";
import express from "express";

const router = express.Router();

// Blog routes
router.get(
  "/api/blogs",
  [auth, adminMiddleware, ownerMiddleware],  // Use separate middleware functions
  BlogsController.get
);
router.get("/api/blogs/search", [auth], BlogsController.getBlogSearch);
router.post("/api/blogs", [auth], BlogsController.create);
router.delete("/api/blogs/:id", [auth], BlogsController.delete);

// User profile routes
router.get("/api/profile", [auth], UsersController.getProfile);
router.patch("/api/update/profile", [auth], UsersController.updateProfile);
router.patch("/api/update/password/profile", [auth], UsersController.updatePassword);

// User management routes
router.get("/api/users/search", [auth], UsersController.getUserSearch);
router.get("/api/users", [auth], UsersController.get);
router.post("/api/users/sign-up", UsersController.create);
router.post("/api/users/sign-in", UsersController.register);
router.delete("/api/users/:id", [auth], UsersController.delete);
router.put("/api/users/:id", [auth], UsersController.update);

export default router;
