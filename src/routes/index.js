import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  try {
    return res.status(200).render('index', { title: 'Express' });
  } catch (error) {
    return next(error);
  }
});

export default router;
