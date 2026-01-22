import { Router } from 'express';
import videojuegos from './videojuego.routes';

const router = Router();

router.use('/videojuegos', videojuegos);

export default router;
