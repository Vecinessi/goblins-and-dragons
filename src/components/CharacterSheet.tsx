
import { useState } from 'react';
import type { Character } from '../types';

interface CharacterSheetProps {
    character: Character;
    onEdit: () => void;
    onClose: () => void;
    onUpdateNotes: (notes: string) => void;
}

export function CharacterSheet({ character, onEdit, onClose, onUpdateNotes }: CharacterSheetProps) {
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notes, setNotes] = useState(character.notes || '');

    const handleNotesDoubleClick = () => {
        setIsEditingNotes(true);
    };

    const handleNotesBlur = () => {
        setIsEditingNotes(false);
        if (notes !== character.notes) {
            onUpdateNotes(notes);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-white animate-fade-in overflow-hidden relative">
            {/* Header Image Background */}
            <div className="h-64 relative shrink-0">
                {character.image ? (
                    <>
                        <div className="absolute inset-0">
                            <img src={character.image} className="w-full h-full object-cover opacity-50 blur-sm" />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                        </div>
                        <div className="absolute -bottom-16 left-8 w-32 h-32 rounded-full border-4 border-zinc-950 shadow-2xl overflow-hidden z-10 bg-zinc-900">
                            <img src={character.image} className="w-full h-full object-cover" />
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 to-zinc-950 " />
                )}

                {/* Top Actions */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                        onClick={onEdit}
                        className="bg-zinc-800/80 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-md transition flex items-center gap-2"
                    >
                        ✏️ Editar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-zinc-800/80 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-bold backdrop-blur-md transition"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto pt-20 px-8 pb-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
                        <div className="flex items-center gap-3 text-lg text-zinc-400">
                            <span className="text-orange-500 font-bold">{character.race}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                            <span>{character.class}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                            <span className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 text-sm">Nível {character.level}</span>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <div className="text-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 min-w-[100px]">
                            <span className="block text-zinc-500 text-sm uppercase tracking-wider mb-1">HP</span>
                            <span className="text-2xl font-bold text-green-500">{character.currentHp} <span className="text-zinc-600 text-lg">/ {character.maxHp}</span></span>
                        </div>
                        <div className="text-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 min-w-[100px]">
                            <span className="block text-zinc-500 text-sm uppercase tracking-wider mb-1">CA</span>
                            <span className="text-2xl font-bold text-blue-400">{character.armorClass}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Biography */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-orange-500 border-b border-zinc-800 pb-2">História</h3>
                        <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {character.biography || <span className="text-zinc-600 italic">Nenhuma história registrada.</span>}
                        </div>
                    </div>

                    {/* Right Column: Notes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <h3 className="text-xl font-bold text-orange-500">Notas</h3>
                            <span className="text-xs text-zinc-500">(Duplo clique para editar)</span>
                        </div>

                        <div
                            onDoubleClick={handleNotesDoubleClick}
                            className={`min-h-[200px] p-4 rounded-lg transition ${isEditingNotes ? 'bg-zinc-800 ring-2 ring-orange-500' : 'bg-zinc-900/50 hover:bg-zinc-900 cursor-text'}`}
                        >
                            {isEditingNotes ? (
                                <textarea
                                    autoFocus
                                    className="w-full h-full bg-transparent outline-none resize-none text-zinc-300 leading-relaxed min-h-[200px]"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    onBlur={handleNotesBlur}
                                />
                            ) : (
                                <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">
                                    {notes || <span className="text-zinc-600 italic">Clique duas vezes para adicionar notas...</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
