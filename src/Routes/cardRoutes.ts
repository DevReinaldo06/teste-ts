import { Router } from "express";
import cardController from "../Controllers/cardController"; // Importa o Controller de Cards

const router = Router();

// Mapeamento das rotas para os métodos do Controller de Cards
//
// GET /cards
router.get("/", cardController.getAll);

// GET /cards/:id
router.get("/:id", cardController.getById);

// POST /cards
router.post("/", cardController.create);

// PUT /cards/:id
router.put("/:id", cardController.update);

// DELETE /cards/:id
router.delete("/:id", cardController.delete);

export default router;