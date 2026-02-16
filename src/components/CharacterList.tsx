
import type { Character } from '../types';

interface CharacterListProps {
    characters: Character[];
    searchTerm: string;
    onSelect: (character: Character) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
}

export function CharacterList({ characters, searchTerm, onSelect, onDelete, onCreate }: CharacterListProps) {
    const filteredCharacters = characters.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.race.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <span className="text-zinc-400">Itens por página</span>
                    <select className="ml-2 bg-zinc-800 border border-zinc-700 text-white rounded px-2 py-1 text-sm outline-none focus:border-orange-500">
                        <option>24</option>
                        <option>48</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    {/* Pagination removed */}
                </div>
            </div>

            {filteredCharacters.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                    <p className="mb-4 text-lg">Nenhum personagem encontrado.</p>
                    <button
                        onClick={onCreate}
                        className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold transition flex items-center gap-2"
                    >
                        Criar Primeiro Personagem
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCharacters.map((char) => (
                        <div
                            key={char.id}
                            className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-orange-500 transition group cursor-pointer relative"
                            onClick={() => onSelect(char)}
                        >
                            <div className="h-48 bg-zinc-900 relative">
                                {char.image ? (
                                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-700">
                                        👤
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(char.id); }}
                                        className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm"
                                        title="Excluir"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-white mb-1 truncate">{char.name}</h3>
                                <p className="text-orange-400 text-sm mb-3">{char.race} • {char.class} {char.level}</p>

                                <div className="flex justify-between text-xs text-zinc-400 bg-zinc-900/50 p-2 rounded">
                                    <div className="text-center">
                                        <span className="block text-zinc-500 mb-0.5">PV</span>
                                        <span className="text-white font-bold">{char.currentHp}/{char.maxHp}</span>
                                    </div>
                                    <div className="text-center border-l border-zinc-700 pl-4 ml-4">
                                        <span className="block text-zinc-500 mb-0.5">CA</span>
                                        <span className="text-white font-bold">{char.armorClass}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
