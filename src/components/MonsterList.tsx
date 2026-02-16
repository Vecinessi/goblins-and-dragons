import { useState, useMemo } from 'react';
import type { Monster } from '../types';

interface MonsterListProps {
    monsters: Monster[];
    onSelect: (monster: Monster) => void;
    savedNotes: Record<string, string>;
    onCreateNew: () => void;
}

export function MonsterList({ monsters, onSelect, savedNotes, onCreateNew }: MonsterListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const filteredMonsters = useMemo(() => {
        return monsters.filter(monster => {
            const matchesSearch = monster.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter ? monster.type.toLowerCase().includes(typeFilter.toLowerCase()) : true;
            return matchesSearch && matchesType;
        });
    }, [monsters, searchTerm, typeFilter]);

    const uniqueTypes = useMemo(() => {
        // Extract the main type (e.g., "Medium Elemental (Aarakocra)" -> "Elemental")
        // Skip the first word (size) and get the actual type
        const types = new Set(monsters.map(m => {
            const parts = m.type.split(' ');
            if (parts.length > 1) {
                // Second word is the type, remove any parentheses or commas
                return parts[1].split(/[\(,]/)[0].trim();
            }
            return parts[0].split(/[\(,]/)[0].trim();
        }));
        return Array.from(types).sort();
    }, [monsters]);

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="flex-none p-6 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-zinc-950 font-bold text-2xl">
                            🐉
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-wide">Bestiário</h1>
                            <p className="text-zinc-400 text-sm">Biblioteca de Criaturas</p>
                        </div>
                    </div>
                    <button
                        onClick={onCreateNew}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        <span>+</span> Criar Monstro
                    </button>
                </div>

                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar criatura..."
                        className="flex-1 bg-zinc-950 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="bg-zinc-950 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="">Todos os Tipos</option>
                        {uniqueTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMonsters.map(monster => {
                        const hasNote = savedNotes && savedNotes[monster.id] && savedNotes[monster.id].trim().length > 0;
                        return (
                            <div
                                key={monster.id}
                                onClick={() => onSelect(monster)}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/20 transition cursor-pointer group flex flex-col gap-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                                    <span className="text-purple-400">Ver Ficha →</span>
                                </div>
                                {hasNote && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-500 rounded-full" title="Tem anotação" />
                                )}

                                <div>
                                    <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition">{monster.name}</h3>
                                    <p className="text-xs text-zinc-500">{monster.type} • CR {monster.challenge}</p>
                                </div>

                                <div className="mt-auto pt-2 border-t border-zinc-800 flex justify-between text-sm text-zinc-400">
                                    <span>AC: <span className="text-white">{monster.ac}</span></span>
                                    <span>HP: <span className="text-white">{monster.hp}</span></span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {filteredMonsters.length === 0 && (
                    <div className="text-center text-zinc-500 mt-20">
                        Nenhum monstro encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
