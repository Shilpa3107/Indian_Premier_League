import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const getAllPlayers = async (req: Request, res: Response) => {
    try {
        const querySchema = z.object({
            page: z.coerce.number().int().min(1).default(1),
            limit: z.coerce.number().int().min(1).max(200).default(20),
            teamId: z.coerce.number().int().min(1).optional(),
        });

        const parsed = querySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }

        const { page, limit, teamId } = parsed.data;
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
        const paramsSchema = z.object({
            id: z.coerce.number().int().min(1),
        });

        const parsed = paramsSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid player id' });
        }

        const { id } = parsed.data;
        const player = await prisma.player.findUnique({
            where: { id },
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
