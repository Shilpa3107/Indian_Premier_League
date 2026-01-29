import React from 'react';
import { LayoutDashboard, Users, Trophy, Activity } from 'lucide-react';

interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'teams', label: 'Teams', icon: Users },
        { id: 'standings', label: 'Standings', icon: Trophy },
    ];

    return (
        <nav className="glass-card mb-8 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Activity className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-text-muted">
                    IPL Insight
                </span>
            </div>

            <div className="flex gap-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'hover:bg-surface text-text-muted hover:text-white'
                            }`}
                    >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
