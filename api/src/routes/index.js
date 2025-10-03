import { Router} from 'express';
import authRoutes from './auth.routes.js';



const router = Router();


// testing to see if server is running
router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.use('/auth', authRoutes);

export default router;