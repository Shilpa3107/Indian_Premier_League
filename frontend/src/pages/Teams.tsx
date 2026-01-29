import React, { useEffect, useState } from 'react';
import { getTeams, getPlayers } from '../api';
import { Users, Search, User } from 'lucide-react';

const Teams: React.FC = () => {
    const [teams, setTeams] = useState<any[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const data = await getTeams();
                setTeams(data);
                if (data.length > 0) {
                    setSelectedTeam(data[0].id);
                }
            } catch (error) {
                console.error('Error fetching teams:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (selectedTeam) {
            const fetchPlayers = async () => {
                setLoadingPlayers(true);
                try {
                    const data = await getPlayers(1, 40, selectedTeam);
                    setPlayers(data.data);
                } catch (error) {
                    console.error('Error fetching players:', error);
                } finally {
                    setLoadingPlayers(false);
                }
            };
            fetchPlayers();
        }
    }, [selectedTeam]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in flex flex-col md:flex-row gap-8">
            {/* Teams List */}
            <div className="w-full md:w-80 space-y-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-4 text-primary" /> IPL Teams
                </h3>
                <div className="space-y-2">
                    {teams.map((team) => (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeam(team.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedTeam === team.id
                                    ? 'bg-primary border-primary text-white shadow-lg'
                                    : 'bg-surface border-border text-text-muted hover:border-primary/50'
                                }`}
                        >
                            <img src={team.logoUrl} alt="" className="w-8 h-8 rounded-full bg-white p-1" />
                            <span className="font-medium text-sm text-left">{team.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Players Grid */}
            <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">
                        {teams.find(t => t.id === selectedTeam)?.title} Squad
                    </h3>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search players..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-surface border border-border rounded-lg outline-none focus:border-primary transition-all w-full md:w-64"
                        />
                    </div>
                </div>

                {loadingPlayers ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse text-text-muted">Loading players...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPlayers.map((player) => (
                            <div key={player.id} className="glass-card p-4 hover:border-primary/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center border border-border group-hover:bg-primary/20 transition-colors">
                                        <User className="w-6 h-6 text-text-muted group-hover:text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{player.name}</h4>
                                        <p className="text-xs text-text-muted uppercase tracking-wider">{player.playingRole}</p>
                                        <p className="text-[10px] text-text-muted mt-1">{player.country === 'in' ? 'India' : player.country.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Teams;
