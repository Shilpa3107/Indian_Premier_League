import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

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
        const { id } = req.params;
        const team = await prisma.team.findUnique({
            where: { id: parseInt(id) },
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
