import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const getAllTeams = async (req: Request, res: Response) => {
    try {
        const teams = await prisma.team.findMany();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTeamById = async (req: Request, res: Response) => {
    try {
        const paramsSchema = z.object({
            id: z.coerce.number().int().min(1),
        });

        const parsed = paramsSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid team id' });
        }

        const { id } = parsed.data;
        const team = await prisma.team.findUnique({
            where: { id },
            include: {
                players: true,
                standings: true,
            },
        });

        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
