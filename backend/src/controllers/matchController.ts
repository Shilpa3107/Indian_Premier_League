import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const getAllMatches = async (req: Request, res: Response) => {
    try {
        const querySchema = z.object({
            page: z.coerce.number().int().min(1).default(1),
            limit: z.coerce.number().int().min(1).max(100).default(10),
        });

        const parsed = querySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid query parameters' });
        }

        const { page, limit } = parsed.data;
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
        const paramsSchema = z.object({
            id: z.coerce.number().int().min(1),
        });

        const parsed = paramsSchema.safeParse(req.params);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid match id' });
        }

        const { id } = parsed.data;
        const match = await prisma.match.findUnique({
            where: { id },
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
