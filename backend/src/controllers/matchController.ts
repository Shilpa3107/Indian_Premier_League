import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMatches = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const matches = await prisma.match.findMany({
            skip,
            take: limit,
            include: {
                teamA: true,
                teamB: true,
                winningTeam: true,
            },
        });

        const total = await prisma.match.count();

        res.json({
            data: matches,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMatchById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const match = await prisma.match.findUnique({
            where: { id: parseInt(id) },
            include: {
                teamA: true,
                teamB: true,
                winningTeam: true,
            },
        });

        if (!match) {
            return res.status(404).json({ error: 'Match not found' });
        }

        res.json(match);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
