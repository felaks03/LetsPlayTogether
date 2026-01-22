const { Router } = require("express");
const ctrl = require("../controllers/videojuego.controller");

const router = Router();

router.get("/", ctrl.videojuegoGetAll);
router.get("/:id", ctrl.videojuegoGetById);
router.post("/", ctrl.videojuegoCreate);
router.put("/:id", ctrl.videojuegoUpdate);
router.delete("/:id", ctrl.videojuegoDelete);

module.exports = router;