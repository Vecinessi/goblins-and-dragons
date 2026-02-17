import { useState } from 'react';
import type { Campaign } from '../types';

interface DashboardProps {
  user: { username: string };
  campaigns: Campaign[];
  onSelectCampaign: (id: string) => void;
  onCreateCampaign: (title: string, desc: string) => void;
  onDeleteCampaign: (id: string) => void;
  onLogout: () => void;
}

export function Dashboard({ user, campaigns, onSelectCampaign, onCreateCampaign, onDeleteCampaign, onLogout }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    onCreateCampaign(newTitle, newDesc);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-5 bg-zinc-900 border-b border-zinc-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-xl font-bold text-zinc-950">
            🐲
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-orange-500">Goblins & Dragons</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-200">{user.username}</p>
            <p className="text-xs text-green-500">Online</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-700 border border-zinc-600 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" alt="Avatar" className="w-full h-full" />
          </div>
          <button onClick={onLogout} className="text-xs text-gray-500 hover:text-red-400 ml-2">Sair</button>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
            ⛺ Minhas Campanhas
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg transition shadow-lg shadow-orange-900/20 flex items-center gap-2"
          >
            + Criar Campanha
          </button>
        </div>

        {/* GRID DE CAMPANHAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              <div className="text-6xl mb-4">📜</div>
              <p>Nenhuma campanha encontrada. Crie sua primeira aventura!</p>
            </div>
          )}

          {campaigns.map(camp => (
            <div
              key={camp.id}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => onSelectCampaign(camp.id)}
            >
              {/* Imagem de Capa (Placeholder) */}
              <div className="h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white shadow-black drop-shadow-md">{camp.title}</h3>
                </div>

                {/* Botão de Excluir (Só aparece no Hover) */}
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteCampaign(camp.id); }}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-600 rounded text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Excluir Campanha"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>

              <div className="p-4">
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                  {camp.description || "Sem descrição..."}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-zinc-800 pt-3">
                  <span className="flex items-center gap-1">👤 Mestre {user.username}</span>
                  <span>📅 {new Date(camp.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-3 w-full bg-orange-600/10 text-orange-500 text-center py-2 rounded font-bold text-sm group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  Entrar
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE CRIAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl w-full max-w-md shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Nova Aventura</h3>
            <input
              className="w-full bg-zinc-800 border border-zinc-600 text-white p-3 rounded mb-3 focus:border-orange-500 outline-none"
              placeholder="Nome da Campanha"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="w-full bg-zinc-800 border border-zinc-600 text-white p-3 rounded mb-6 focus:border-orange-500 outline-none resize-none h-24"
              placeholder="Breve descrição..."
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
              <button type="submit" className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold">Criar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}