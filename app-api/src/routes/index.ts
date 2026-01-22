import { Router } from "express";

const router = Router();

let videojuegosRouter: any;
try {

  videojuegosRouter = require("./videojuego.routes.js");
} catch (e) {

  videojuegosRouter =
    require("./videojuego.routes").default || require("./videojuego.routes");
}

router.use("/videojuegos", videojuegosRouter);

export default router;