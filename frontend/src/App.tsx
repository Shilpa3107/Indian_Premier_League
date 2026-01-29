import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Standings from './pages/Standings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen pb-20">
      <div className="container pt-6">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'teams' && <Teams />}
          {activeTab === 'standings' && <Standings />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-border/30 pt-8 pb-12 text-center text-text-muted text-sm">
        <div className="container">
          <p>© 2026 IPL Data Platform • Built with React & Node.js</p>
          <div className="flex items-center justify-center gap-6 mt-4 opacity-50">
            <span>Next.js</span>
            <span>Prisma</span>
            <span>PostgreSQL</span>
            <span>Tailwind Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
