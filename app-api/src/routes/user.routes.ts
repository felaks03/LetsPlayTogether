import { Router } from "express";
import {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUserController);
router.get("/", getUsersController);
router.get("/:id", getUserByIdController);
router.put("/:id", updateUserController);
router.delete("/:id", deleteUserController);

export default router;
