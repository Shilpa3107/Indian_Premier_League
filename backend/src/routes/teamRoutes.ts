import { Router } from 'express';
import { getAllTeams, getTeamById } from '../controllers/teamController';

const router = Router();

/**
 * @openapi
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: List of teams
 */
router.get('/', getAllTeams);

/**
 * @openapi
 * /api/teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Team details
 */
router.get('/:id', getTeamById);

export default router;
