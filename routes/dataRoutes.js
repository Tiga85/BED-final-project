import express from 'express';
import { getAllData } from '../services/dataService.js';

const router = express.Router();

router.get('/all-data', getAllData);

export default router;
