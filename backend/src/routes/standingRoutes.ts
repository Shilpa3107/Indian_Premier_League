import { Router } from 'express';
import { getStandings } from '../controllers/standingController';

const router = Router();

/**
 * @openapi
 * /api/standings:
 *   get:
 *     summary: Get IPL 2022 standings
 *     tags: [Standings]
 *     responses:
 *       200:
 *         description: List of team standings
 */
router.get('/', getStandings);

export default router;
