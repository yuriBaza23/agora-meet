import {Router} from 'express';
import {meetRoutes} from './meet.routes';

const router = Router();

router.use('/meet', meetRoutes);
export {router};
