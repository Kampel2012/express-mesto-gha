import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUsersAvatar,
} from "../controllers/usersControllers.js";

const router = Router();

router.get("/", getAllUsers);

router.get("/:userId", getUserById);

router.patch("/me", updateUser);

router.patch("/me/avatar", updateUsersAvatar);

export default router;
