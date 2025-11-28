// src/Routes/userRoutes.ts

import { Router } from "express";
// ✅ CORREÇÃO: Importa todas as exportações nomeadas como um objeto
import * as userController from "../Controllers/userController"; 

const router = Router();

// Mapeamento das rotas para os métodos do Controller
router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.post("/", userController.register);
router.put("/:id", userController.updateProfile);
// ✅ CORREÇÃO: Usa o nome 'deleteUser' que criamos no Controller/Service
router.delete("/:id", userController.deleteUser); 

export default router;