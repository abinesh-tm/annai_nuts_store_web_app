import express from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, admin, getCustomers);
router.get('/:id', protect, admin, getCustomerById);

export default router;

