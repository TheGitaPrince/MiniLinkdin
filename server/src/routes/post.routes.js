import { Router } from "express";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";
import { createPost, getAllPosts, getPostsByUser, updatePost, deletePost } from "../controllers/post.controller.js";

const postRouter = Router();

postRouter.route("/create").post(veriyfyJWT, createPost);
postRouter.route("/get-post").get(getAllPosts);
postRouter.route("/my-post").get(veriyfyJWT, getPostsByUser);
postRouter.route("/:postId").patch(veriyfyJWT, updatePost);
postRouter.route("/:postId").delete(veriyfyJWT, deletePost);

export default postRouter;