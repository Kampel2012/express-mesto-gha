import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUsersAvatar,
  getUserInfo,
} from "../controllers/usersControllers.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/me", getUserInfo);

router.get("/:userId", getUserById);

router.patch("/me", updateUser);

router.patch("/me/avatar", updateUsersAvatar);

export default router;
