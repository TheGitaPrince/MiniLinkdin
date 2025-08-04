import { Router } from "express";
import { veriyfyJWT } from "../middlewares/auth.middleware.js";
import { createUser ,loginUser, update, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/create").post(createUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/update").patch(veriyfyJWT, update);
userRouter.route("/logout").post(veriyfyJWT, logoutUser);
userRouter.route("/refresh").post(refreshAccessToken);

export default userRouter;
