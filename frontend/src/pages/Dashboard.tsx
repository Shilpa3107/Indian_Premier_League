import React, { useEffect, useState } from 'react';
import { getStandings, getMatches } from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Trophy, Calendar, Target, TrendingUp } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4', '#475569', '#f97316'];

const Dashboard: React.FC = () => {
    const [standings, setStandings] = useState<any[]>([]);
    const [recentMatches, setRecentMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [standingsData, matchesData] = await Promise.all([
                    getStandings(),
                    getMatches(1, 5)
                ]);
                setStandings(standingsData);
                setRecentMatches(matchesData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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
                    <p className="text-sm text-text-muted">No standings data available.</p>
                </div>
            </div>
        );
    }

    const chartData = standings.map(s => ({
        name: s.team.abbr,
        points: s.points,
        wins: s.win
    }));

    return (
        <div className="animate-fade-in space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Teams" value="10" icon={<Target className="text-secondary" />} trend="+0 this season" />
                <StatCard title="Matches Played" value="74" icon={<Calendar className="text-primary" />} trend="2022 Season" />
                <StatCard title="Champion" value="GT" icon={<Trophy className="text-accent" />} trend="Gujarat Titans" />
                <StatCard title="Win Ratio Avg" value="0.5" icon={<TrendingUp className="text-emerald-500" />} trend="Stable" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Points Chart */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-4 text-primary" /> Team Performance (Points)
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="points" fill="url(#colorPoints)" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                                <defs>
                                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Win Distribution Char */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Trophy className="w-5 h-4 text-secondary" /> Win Distribution
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="wins"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Matches */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-4 text-accent" /> Recent Matches
                </h3>
                {recentMatches.length === 0 ? (
                    <div className="text-sm text-text-muted">No recent matches available.</div>
                ) : (
                    <div className="space-y-4">
                        {recentMatches.map((match) => (
                            <div key={match.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-surface transition-colors">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="flex items-center gap-3 justify-end w-[200px]">
                                        <span className="font-semibold">{match.teamA.abbr}</span>
                                        <img src={match.teamA.logoUrl} alt="" className="w-8 h-8 rounded-full bg-white p-1" />
                                    </div>
                                    <div className="text-text-muted font-bold text-lg">VS</div>
                                    <div className="flex items-center gap-3 w-[200px]">
                                        <img src={match.teamB.logoUrl} alt="" className="w-8 h-8 rounded-full bg-white p-1" />
                                        <span className="font-semibold">{match.teamB.abbr}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-sm font-medium text-emerald-400">{match.result}</div>
                                    <div className="text-xs text-text-muted">{new Date(match.dateStart).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="glass-card p-6 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-xl shadow-inner">
            {icon}
        </div>
        <div>
            <p className="text-sm text-text-muted font-medium">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">{trend}</p>
        </div>
    </div>
);

export default Dashboard;
