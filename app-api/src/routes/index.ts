import { Router } from 'express';

const router = Router();

let videojuegosRouter: any;
try {
	// prefer JS implementation if present
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	videojuegosRouter = require('./videojuego.routes.js');
} catch (e) {
	// fallback to TS module
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	videojuegosRouter = require('./videojuego.routes').default || require('./videojuego.routes');
}

router.use('/videojuegos', videojuegosRouter);

export default router;
