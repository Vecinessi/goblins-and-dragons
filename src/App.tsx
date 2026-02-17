import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import type { WindowState, Campaign, NoteNode, User, Character, Monster } from './types';

// Lazy Load Components
const Dashboard = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.Dashboard })));
const NotesPanel = lazy(() => import('./components/features/notes/NotesPanel').then(module => ({ default: module.NotesPanel })));
const DiceRoller = lazy(() => import('./components/features/dice/DiceRoller').then(module => ({ default: module.DiceRoller })));
const Characters = lazy(() => import('./components/features/characters/Characters').then(module => ({ default: module.Characters })));
const Bestiary = lazy(() => import('./components/features/bestiary/Bestiary').then(module => ({ default: module.Bestiary })));
const LoginScreen = lazy(() => import('./components/features/auth/LoginScreen').then(module => ({ default: module.LoginScreen })));

// Loading Spinner Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-zinc-950 text-orange-500">
    <div className="animate-spin text-4xl">🐲</div>
  </div>
);

// DADOS PADRÃO PARA PRIMEIRA VEZ
const DEFAULT_NODES: NoteNode[] = [
  { id: '1', name: 'Informações Gerais', type: 'folder', isOpen: true, children: [] },
  { id: '2', name: 'Diário de Sessão', type: 'file', content: '<p>Aventura começa aqui...</p>' }
];

function App() {
  // --- ESTADOS GLOBAIS ---
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gnd_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'CAMPAIGN'>(() => {
    return localStorage.getItem('gnd_user') ? 'DASHBOARD' : 'LOGIN';
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('gnd_campaigns');
    if (!saved) return [];
    const parsed = JSON.parse(saved) as Campaign[];
    // Migração: limpar monstros customizados no formato antigo (schema incompatível)
    const migrated = parsed.map(c => ({ ...c, customMonsters: [] }));
    localStorage.setItem('gnd_campaigns', JSON.stringify(migrated));
    return migrated;
  });

  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Estado da Janela de Notas (agora controlada aqui)
  const [notesState, setNotesState] = useState<WindowState>('CLOSED');
  const [diceState, setDiceState] = useState<WindowState>('CLOSED');

  // View dentro da Campanha
  const [campaignView, setCampaignView] = useState<'HOME' | 'CHARACTERS' | 'BESTIARY'>('HOME');

  // --- PERSISTÊNCIA AUTOMÁTICA ---
  useEffect(() => {
    if (user) {
      localStorage.setItem('gnd_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gnd_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gnd_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // --- AÇÕES ---

  const handleLogin = (username: string) => {
    const newUser = { username, avatarUrl: '' };
    setUser(newUser); // Effect salva no localStorage
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null); // Effect remove do localStorage
    setView('LOGIN');
    setNotesState('CLOSED');
  };

  const handleCreateCampaign = (title: string, desc: string) => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title,
      description: desc,
      createdAt: new Date().toISOString(),
      data: DEFAULT_NODES,
      characters: [],
      monsterNotes: {}
    };
    setCampaigns(prev => [...prev, newCampaign]);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Tem certeza que deseja apagar esta campanha e todas as notas?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSelectCampaign = (id: string) => {
    setSelectedCampaignId(id);
    setView('CAMPAIGN');
    // Já abre a janela de notas automaticamente ao entrar
    setNotesState('OPEN');
  };

  // Quando o NotesPanel muda algo, atualizamos a campanha específica
  const handleSaveNotes = useCallback((newNodes: NoteNode[]) => {
    if (!selectedCampaignId) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaignId) {
        return { ...c, data: newNodes };
      }
      return c;
    }));
  }, [selectedCampaignId]);

  // Handlers para Personagens
  const handleSaveCharacter = (character: Character) => {
    if (!selectedCampaignId) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaignId) {
        const existingIndex = c.characters?.findIndex(char => char.id === character.id);
        let newCharacters = c.characters || [];

        if (existingIndex !== undefined && existingIndex >= 0) {
          newCharacters = [...newCharacters];
          newCharacters[existingIndex] = character;
        } else {
          newCharacters = [...newCharacters, character];
        }

        return { ...c, characters: newCharacters };
      }
      return c;
    }));
  };

  const handleDeleteCharacter = (id: string) => {
    if (!selectedCampaignId) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaignId) {
        return {
          ...c,
          characters: (c.characters || []).filter(char => char.id !== id)
        };
      }
      return c;
    }));
  };

  // Handler para Notas de Monstros
  const handleSaveMonsterNote = (monsterId: string, content: string) => {
    if (!selectedCampaignId) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaignId) {
        const newNotes = { ...(c.monsterNotes || {}) };
        newNotes[monsterId] = content;
        return { ...c, monsterNotes: newNotes };
      }
      return c;
    }));
  };

  // Handlers para Monstros Customizados
  const handleSaveCustomMonster = (monster: Monster) => {
    if (!selectedCampaignId) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaignId) {
        const existingIndex = c.customMonsters?.findIndex(m => m.id === monster.id);
        let newMonsters = c.customMonsters || [];

        if (existingIndex !== undefined && existingIndex >= 0) {
          newMonsters = [...newMonsters];
          newMonsters[existingIndex] = monster;
        } else {
          newMonsters = [...newMonsters, monster];
        }

        return { ...c, customMonsters: newMonsters };
      }
      return c;
    }));
  };

  const handleDeleteCustomMonster = (id: string) => {
    if (!selectedCampaignId) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === selectedCampaignId) {
        return {
          ...c,
          customMonsters: (c.customMonsters || []).filter(m => m.id !== id)
        };
      }
      return c;
    }));
  };

  // --- RENDERIZAÇÃO ---

  return (
    <Suspense fallback={<LoadingFallback />}>
      {/* 1. TELA DE LOGIN (Genérica) */}
      {view === 'LOGIN' && <LoginScreen onLogin={handleLogin} />}

      {/* 2. DASHBOARD (Lista de Campanhas) */}
      {view === 'DASHBOARD' && user && (
        <Dashboard
          user={user}
          campaigns={campaigns}
          onSelectCampaign={handleSelectCampaign}
          onCreateCampaign={handleCreateCampaign}
          onDeleteCampaign={handleDeleteCampaign}
          onLogout={handleLogout}
        />
      )}

      {/* 3. CAMPANHA */}
      {view === 'CAMPAIGN' && (() => {
        const currentCampaign = campaigns.find(c => c.id === selectedCampaignId);
        if (!currentCampaign) return null;

        return (
          <div className="min-h-screen bg-zinc-900 text-white font-sans relative overflow-hidden">
            {/* Cabeçalho da Campanha */}
            <header className="flex items-center justify-between px-6 py-4 bg-zinc-800 border-b border-zinc-700 shadow-md">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('DASHBOARD')}>
                <button className="text-gray-400 hover:text-white mr-2">← Voltar</button>
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-zinc-900">G&D</div>
                <h1 className="text-xl font-bold tracking-wider text-orange-500 truncate max-w-[1000px]">
                  {currentCampaign.title}
                </h1>
              </div>
              <nav className="flex gap-4">
                <button
                  onClick={() => setCampaignView(prev => prev === 'CHARACTERS' ? 'HOME' : 'CHARACTERS')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-md cursor-pointer ${campaignView === 'CHARACTERS' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-300 hover:text-white hover:bg-zinc-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  </svg>
                  Personagens
                </button>
                <button
                  onClick={() => setCampaignView(prev => prev === 'BESTIARY' ? 'HOME' : 'BESTIARY')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-md cursor-pointer ${campaignView === 'BESTIARY' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-300 hover:text-white hover:bg-zinc-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M16.875 3.094c-.29.004-.543.152-.75.375L9.5 11.75c-.527.616-.7 1.426-.438 2.156.262.73.89 1.25 1.625 1.438l-5.5 6.375c-.527.616-.7 1.426-.437 2.156.262.73.89 1.25 1.625 1.438l-.688.812c-.527.616-.7 1.426-.437 2.156.263.73.89 1.23 1.625 1.407.734.175 1.543.007 2.156-.438 0 0 4.388-3.188 6.5-4.688.14.239.34.438.563.594l-4.156 3c-.527.616-.7 1.426-.438 2.156.262.73.89 1.23 1.625 1.407.734.175 1.543.007 2.156-.438l6.625-4.812c.527-.616.7-1.426.438-2.156-.075-.21-.2-.394-.344-.563l3.906-2.844c.528-.616.7-1.426.438-2.156-.263-.73-.89-1.23-1.625-1.406-.735-.176-1.543-.008-2.157.437l-1.687 1.219 2.188-2.531c.527-.616.7-1.426.437-2.156-.263-.73-.89-1.25-1.625-1.438-.734-.187-1.543-.007-2.156.438l-3.156 3.656 3.718-8.25c.305-.633.195-1.402-.28-1.969-.356-.422-.8-.594-1.218-.562z" />
                  </svg>
                  Bestiário
                </button>
                <button
                  onClick={() => setDiceState(prev => prev === 'CLOSED' ? 'OPEN' : prev)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-md cursor-pointer ${diceState !== 'CLOSED' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-300 hover:text-white hover:bg-zinc-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z" />
                    <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                  </svg>
                  Dados
                </button>
                <button
                  onClick={() => setNotesState('OPEN')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-md cursor-pointer ${notesState !== 'CLOSED' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-300 hover:text-white hover:bg-zinc-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" /></svg>
                  Notas
                </button>
              </nav>
            </header>

            {/* Fundo temático */}
            {campaignView === 'HOME' && (
              <main className="p-8 text-center text-gray-500 mt-20">
                <h2 className="text-3xl font-bold text-gray-700 mb-2">{currentCampaign.title}</h2>
                <p>O painel da campanha está pronto. Abra suas notas, gerencie personagens ou consulte o bestiário!</p>
              </main>
            )}

            {/* CHARACTERS VIEW */}
            {campaignView === 'CHARACTERS' && (
              <div className="absolute inset-0 top-[72px] z-0">
                <Characters
                  characters={currentCampaign.characters || []}
                  onSaveCharacter={handleSaveCharacter}
                  onDeleteCharacter={handleDeleteCharacter}
                />
              </div>
            )}

            {/* BESTIARY VIEW */}
            {campaignView === 'BESTIARY' && (
              <div className="absolute inset-0 top-[72px] z-0">
                <Bestiary
                  savedNotes={currentCampaign.monsterNotes || {}}
                  onSaveNote={handleSaveMonsterNote}
                  customMonsters={currentCampaign.customMonsters || []}
                  onSaveMonster={handleSaveCustomMonster}
                  onDeleteMonster={handleDeleteCustomMonster}
                />
              </div>
            )}

            {/* NOTES PANEL */}
            <NotesPanel
              windowState={notesState}
              onClose={() => setNotesState('CLOSED')}
              onMinimize={() => setNotesState('MINIMIZED')}
              onMaximize={() => setNotesState('OPEN')}
              initialNodes={currentCampaign.data}
              onSave={handleSaveNotes}
            />

            {/* DICE ROLLER */}
            <DiceRoller
              windowState={diceState}
              notesState={notesState}
              onClose={() => setDiceState('CLOSED')}
              onMinimize={() => setDiceState('MINIMIZED')}
              onMaximize={() => setDiceState('OPEN')}
            />
          </div>
        );
      })()}
    </Suspense>
  );
}

export default App;