import { useState, useMemo } from 'react';
import type { Monster, CreatureType } from '../../../types';

const CREATURE_TYPES: CreatureType[] = [
    'Aberração', 'Besta', 'Celestial', 'Constructo', 'Corruptor',
    'Dragão', 'Elemental', 'Fada', 'Gigante', 'Humanoide',
    'Limo', 'Monstruosidade', 'Planta', 'Morto-Vivo', 'Outro'
];

interface MonsterListProps {
    monsters: Monster[];
    onSelect: (monster: Monster) => void;
    savedNotes: Record<string, string>;
    onCreateNew: () => void;
}

export function MonsterList({ monsters, onSelect, savedNotes, onCreateNew }: MonsterListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<CreatureType | ''>('');

    const filteredMonsters = useMemo(() => {
        return monsters.filter(monster => {
            const matchesSearch = monster.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter ? monster.type === typeFilter : true;
            return matchesSearch && matchesType;
        });
    }, [monsters, searchTerm, typeFilter]);

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="flex-none p-6 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-zinc-950">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 32 32">
                                <path d="M16.875 3.094c-.29.004-.543.152-.75.375L9.5 11.75c-.527.616-.7 1.426-.438 2.156.262.73.89 1.25 1.625 1.438l-5.5 6.375c-.527.616-.7 1.426-.437 2.156.262.73.89 1.25 1.625 1.438l-.688.812c-.527.616-.7 1.426-.437 2.156.263.73.89 1.23 1.625 1.407.734.175 1.543.007 2.156-.438 0 0 4.388-3.188 6.5-4.688.14.239.34.438.563.594l-4.156 3c-.527.616-.7 1.426-.438 2.156.262.73.89 1.23 1.625 1.407.734.175 1.543.007 2.156-.438l6.625-4.812c.527-.616.7-1.426.438-2.156-.075-.21-.2-.394-.344-.563l3.906-2.844c.528-.616.7-1.426.438-2.156-.263-.73-.89-1.23-1.625-1.406-.735-.176-1.543-.008-2.157.437l-1.687 1.219 2.188-2.531c.527-.616.7-1.426.437-2.156-.263-.73-.89-1.25-1.625-1.438-.734-.187-1.543-.007-2.156.438l-3.156 3.656 3.718-8.25c.305-.633.195-1.402-.28-1.969-.356-.422-.8-.594-1.218-.562z" />
                            </svg>
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
                        onChange={(e) => setTypeFilter(e.target.value as CreatureType | '')}
                    >
                        <option value="">Todos os Tipos</option>
                        {CREATURE_TYPES.map(t => (
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
                                    <p className="text-xs text-zinc-500">{monster.size} {monster.type} • ND {monster.cr}</p>
                                </div>

                                <div className="mt-auto pt-2 border-t border-zinc-800 flex justify-between text-sm text-zinc-400">
                                    <span>CA: <span className="text-white">{monster.ac}</span></span>
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
