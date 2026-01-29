import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStandings = async (req: Request, res: Response) => {
    try {
        const standings = await prisma.standing.findMany({
            include: {
                team: true,
            },
            orderBy: [
                { points: 'desc' },
                { netrr: 'desc' },
            ],
        });

        res.json(standings);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
