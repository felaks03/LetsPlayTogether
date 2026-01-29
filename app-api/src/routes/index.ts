import { Router } from "express";

const router = Router();

let videojuegosRouter: any;
let userRouter: any;

try {
  videojuegosRouter = require("./videojuego.routes.js");
} catch (e) {
  videojuegosRouter =
    require("./videojuego.routes").default || require("./videojuego.routes");
}

try {
  userRouter = require("./user.routes.js");
} catch (e) {
  userRouter =
    require("./user.routes").default || require("./user.routes");
}

router.use("/videojuegos", videojuegosRouter);
router.use("/users", userRouter);

export default router;
