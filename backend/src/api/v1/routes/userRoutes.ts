import express from "express";

import { STATUS_CODES } from "../constants/index.js";
import { loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/userController.js";
import validateSchema from "../middleware/validateSchema.js";
import validateToken from "../middleware/validateToken.js";
import { userLoginSchema, userProfileUpdateSchema, userRegisterSchema } from "../validations/userValidate.js";

const router = express.Router();

router.get("/me", validateToken, (req, res) => {
  res.status(STATUS_CODES.OK).json({
    success: true,
    user: req.user,
  });
});

router.post("/register", validateSchema(userRegisterSchema), registerUser);

router.post("/login", validateSchema(userLoginSchema), loginUser);

router.post("/logout", validateToken, logoutUser);

router.put("/profile", validateToken, validateSchema(userProfileUpdateSchema), updateUserProfile);

export default router;
