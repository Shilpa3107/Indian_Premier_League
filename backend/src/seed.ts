import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataPath = path.join(__dirname, '../../../Indian_Premier_League_2022-03-26');

    // Seed Teams
    const teamsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'teams/teams.json'), 'utf8'));
    for (const team of teamsData) {
        await prisma.team.upsert({
            where: { id: team.tid },
            update: {},
            create: {
                id: team.tid,
                title: team.title,
                abbr: team.abbr,
                logoUrl: team.logo_url,
            },
        });
    }
    console.log('Teams seeded');

    // Seed Players (from squads)
    const squadsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'squads/squads.json'), 'utf8'));
    for (const squad of squadsData) {
        for (const player of squad.players) {
            await prisma.player.upsert({
                where: { id: player.pid },
                update: {},
                create: {
                    id: player.pid,
                    name: player.title,
                    shortName: player.short_name,
                    birthdate: player.birthdate,
                    country: player.country,
                    playingRole: player.playing_role,
                    battingStyle: player.batting_style,
                    bowlingStyle: player.bowling_style,
                    teamId: squad.team_id,
                },
            });
        }
    }
    console.log('Players seeded');

    // Seed Matches
    const matchesData = JSON.parse(fs.readFileSync(path.join(dataPath, 'matches/matches.json'), 'utf8'));
    for (const match of matchesData) {
        await prisma.match.upsert({
            where: { id: match.match_id },
            update: {},
            create: {
                id: match.match_id,
                title: match.title,
                subtitle: match.subtitle,
                matchNumber: match.match_number,
                format: match.format_str,
                venue: match.venue.name,
                location: match.venue.location,
                dateStart: new Date(match.date_start_ist),
                result: match.result || match.status_note,
                teamAId: match.teama.team_id,
                teamBId: match.teamb.team_id,
                winningTeamId: match.winning_team_id !== 0 ? match.winning_team_id : null,
            },
        });
    }
    console.log('Matches seeded');

    // Seed Standings
    const standingsData = JSON.parse(fs.readFileSync(path.join(dataPath, 'standings/standings.json'), 'utf8'));
    for (const round of standingsData.standings) {
        for (const standing of round.standings) {
            await prisma.standing.upsert({
                where: { teamId: standing.team.tid },
                update: {},
                create: {
                    teamId: standing.team.tid,
                    played: parseInt(standing.played),
                    win: parseInt(standing.win),
                    loss: parseInt(standing.loss),
                    nr: parseInt(standing.nr),
                    points: parseInt(standing.points),
                    netrr: parseFloat(standing.netrr),
                },
            });
        }
    }
    console.log('Standings seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
