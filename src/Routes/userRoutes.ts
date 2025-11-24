import { Router } from "express";
import userController from "../Controllers/userController"; 

const router = Router();

// Mapeamento das rotas para os métodos do Controller
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export default router;