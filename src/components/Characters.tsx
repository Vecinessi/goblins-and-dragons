
import { useState } from 'react';
import type { Character } from '../types';
import { CharacterList } from './CharacterList';
import { CharacterForm } from './CharacterForm';
import { CharacterSheet } from './CharacterSheet';

interface CharactersProps {
    characters: Character[];
    onSaveCharacter: (character: Character) => void;
    onDeleteCharacter: (id: string) => void;
}


type ViewMode = 'LIST' | 'CREATE' | 'VIEW' | 'EDIT';

export function Characters({ characters, onSaveCharacter, onDeleteCharacter }: CharactersProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('LIST');
    const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);

    const handleCreateNew = () => {
        setSelectedCharacter(undefined);
        setViewMode('CREATE');
    };

    const handleView = (char: Character) => {
        setSelectedCharacter(char);
        setViewMode('VIEW');
    };

    const handleEdit = () => {
        setViewMode('EDIT');
    };

    const handleSave = (charData: Character | Omit<Character, 'id'>) => {
        // If editing, keep ID. If creating, generate ID.
        const newCharacter: Character = 'id' in charData
            ? (charData as Character)
            : { ...charData, id: Date.now().toString() };

        onSaveCharacter(newCharacter);

        // If we were editing from view mode, go back to view
        if (viewMode === 'EDIT' && selectedCharacter) {
            setSelectedCharacter(newCharacter);
            setViewMode('VIEW');
        } else {
            setViewMode('LIST');
        }
    };

    const handleDeleteClick = (id: string) => {
        setCharacterToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (characterToDelete) {
            onDeleteCharacter(characterToDelete);
            setViewMode('LIST');
            setSelectedCharacter(undefined);
            setDeleteModalOpen(false);
            setCharacterToDelete(null);
        }
    };

    // Only for updating notes from the Sheet
    const handleUpdateNotes = (notes: string) => {
        if (selectedCharacter) {
            const updatedChar = { ...selectedCharacter, notes };
            onSaveCharacter(updatedChar);
            setSelectedCharacter(updatedChar);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header Personagens - Only show in List Mode or Create (to keep context) ?? */}
            {/* Actually, the Sheet has its own header. The Form has its own header. 
                So we only show this main header in LIST mode. 
            */}

            {viewMode === 'LIST' && (
                <>
                    <div className="relative h-40 bg-zinc-900 border-b border-zinc-800 overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-zinc-900/20" />

                        <div className="relative z-10 flex flex-col h-full justify-end px-8 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-zinc-950">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-white tracking-wide">Personagens</h1>

                                <div className="flex-1" />

                                <button
                                    onClick={handleCreateNew}
                                    className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
                                >
                                    <span>⚔️</span> Criar Personagem
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                        <div className="text-sm text-zinc-400">
                            {characters.length} Personagens
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-zinc-800 border border-zinc-700 text-white px-3 py-1.5 rounded-lg text-sm outline-none focus:border-orange-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="flex items-center gap-2 bg-white text-zinc-900 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition">
                                Filtrar
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-zinc-950">
                {viewMode === 'LIST' && (
                    <CharacterList
                        characters={characters}
                        searchTerm={searchTerm}
                        onSelect={handleView}
                        onDelete={handleDeleteClick}
                        onCreate={handleCreateNew}
                    />
                )}

                {viewMode === 'VIEW' && selectedCharacter && (
                    <CharacterSheet
                        character={selectedCharacter}
                        onEdit={handleEdit}
                        onClose={() => setViewMode('LIST')}
                        onUpdateNotes={handleUpdateNotes}
                    />
                )}

                {(viewMode === 'CREATE' || viewMode === 'EDIT') && (
                    <CharacterForm
                        initialData={selectedCharacter}
                        onSave={handleSave}
                        onCancel={() => viewMode === 'EDIT' ? setViewMode('VIEW') : setViewMode('LIST')}
                    />
                )}
            </div>


            {/* DELETE MODAL */}
            {
                deleteModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-md bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-2xl p-6 relative">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-orange-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <h3 className="text-lg font-bold text-white">Deletar Personagem</h3>
                                </div>
                                <button onClick={() => setDeleteModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                            </div>
                            <p className="text-gray-300 text-sm mb-6">
                                Tem certeza que deseja excluir este personagem? <br />
                                Essa ação <b>não pode ser desfeita</b>.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 py-3 rounded-lg font-bold text-gray-300 bg-zinc-700 hover:bg-zinc-600 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all"
                                >
                                    Sim, Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
