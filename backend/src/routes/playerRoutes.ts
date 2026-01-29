import { Router } from 'express';
import { getAllPlayers, getPlayerById } from '../controllers/playerController';

const router = Router();

/**
 * @openapi
 * /api/players:
 *   get:
 *     summary: Get all players
 *     tags: [Players]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: teamId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of players
 */
router.get('/', getAllPlayers);

/**
 * @openapi
 * /api/players/{id}:
 *   get:
 *     summary: Get player by ID
 *     tags: [Players]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Player details
 */
router.get('/:id', getPlayerById);

export default router;
