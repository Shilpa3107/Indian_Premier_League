import React, { useEffect, useState } from 'react';
import { getStandings } from '../api';
import { Trophy, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const Standings: React.FC = () => {
    const [standings, setStandings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                const data = await getStandings();
                setStandings(data);
            } catch (error) {
                console.error('Error fetching standings:', error);
                setError('Failed to load standings. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchStandings();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="glass-card p-6 text-center">
                    <p className="text-sm text-rose-400 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (standings.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="glass-card p-6 text-center">
                    <p className="text-sm text-text-muted">No standings available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-accent" /> IPL 2022 Results Table
                </h3>
                <p className="text-sm text-text-muted">Season 15 Final Standings</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface/50 text-text-muted text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Pos</th>
                                <th className="px-6 py-4 font-semibold">Team</th>
                                <th className="px-6 py-4 font-semibold">P</th>
                                <th className="px-6 py-4 font-semibold">W</th>
                                <th className="px-6 py-4 font-semibold">L</th>
                                <th className="px-6 py-4 font-semibold">NR</th>
                                <th className="px-6 py-4 font-semibold">Pts</th>
                                <th className="px-6 py-4 font-semibold">NRR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {standings.map((row, index) => (
                                <tr key={row.id} className="hover:bg-surface/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold ${index < 4 ? 'bg-primary/20 text-primary' : 'text-text-muted'
                                            }`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={row.team.logoUrl} alt="" className="w-8 h-8 rounded-full bg-white p-1" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{row.team.title}</span>
                                                <span className="text-[10px] text-text-muted">{row.team.abbr}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{row.played}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-emerald-400">{row.win}</td>
                                    <td className="px-6 py-4 text-sm text-rose-400">{row.loss}</td>
                                    <td className="px-6 py-4 text-sm">{row.nr}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-bold">
                                            {row.points}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm">
                                            {row.netrr > 0 ? (
                                                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                                            ) : row.netrr < 0 ? (
                                                <ArrowDownRight className="w-3 h-3 text-rose-400" />
                                            ) : (
                                                <Minus className="w-3 h-3 text-text-muted" />
                                            )}
                                            <span className={row.netrr > 0 ? 'text-emerald-400' : row.netrr < 0 ? 'text-rose-400' : 'text-text-muted'}>
                                                {row.netrr.toFixed(3)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <div className="w-3 h-3 rounded bg-primary/20"></div> Qualified for Playoffs
                </div>
            </div>
        </div>
    );
};

export default Standings;
