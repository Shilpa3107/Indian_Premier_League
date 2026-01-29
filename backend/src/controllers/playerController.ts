import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const teamId = req.query.teamId ? parseInt(req.query.teamId as string) : undefined;
        const skip = (page - 1) * limit;

        const where = teamId ? { teamId } : {};

        const players = await prisma.player.findMany({
            where,
            skip,
            take: limit,
            include: {
                team: true,
            },
        });

        const total = await prisma.player.count({ where });

        res.json({
            data: players,
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

export const getPlayerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const player = await prisma.player.findUnique({
            where: { id: parseInt(id) },
            include: {
                team: true,
            },
        });

        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
