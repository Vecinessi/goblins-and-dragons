import { useState } from 'react';
import type { Monster } from '../types';
import { TiptapEditor } from '../TiptapEditor';

interface MonsterSheetProps {
    monster: Monster;
    onClose: () => void;
    savedNote: string;
    onSaveNote: (note: string) => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function MonsterSheet({ monster, onClose, savedNote, onSaveNote, onEdit, onDelete }: MonsterSheetProps) {
    const [activeTab, setActiveTab] = useState<'STATS' | 'NOTES'>('STATS');

    // Stats Block Helper
    const StatBlock = ({ label, value }: { label: string, value: string | number }) => (
        <div className="flex flex-col items-center bg-zinc-800/50 p-2 rounded lg:w-16">
            <span className="text-xs text-zinc-500 uppercase font-bold">{label}</span>
            <span className="text-lg font-bold text-white">{value}</span>
            <span className="text-xs text-zinc-400">{getMod(Number(value))}</span>
        </div>
    );

    const getMod = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
                <button onClick={onClose} className="text-zinc-400 hover:text-white flex items-center gap-2 transition">
                    ← Voltar
                </button>
                <div className="flex gap-2 bg-zinc-950 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('STATS')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'STATS' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Ficha
                    </button>
                    <button
                        onClick={() => setActiveTab('NOTES')}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition ${activeTab === 'NOTES' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Notas Pessoais
                    </button>
                </div>
                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition"
                        >
                            ✏️ Editar
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={onDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition"
                        >
                            🗑️ Deletar
                        </button>
                    )}
                    {!onEdit && !onDelete && <div className="w-20" />} {/* Spacer for alignment */}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === 'STATS' && (
                    <div className="max-w-4xl mx-auto p-8">
                        <div className="bg-[#e0d3b8] text-[#2c1b11] font-serif p-8 rounded-sm shadow-2xl relative overflow-hidden border-4 border-[#2c1b11] double-border">
                            {/* D&D Style Bg decoration */}
                            <div className="border-b-2 border-[#922610] mb-4 pb-2">
                                <h1 className="text-4xl font-bold uppercase tracking-wider text-[#922610]">{monster.name}</h1>
                                <p className="text-lg italic font-semibold">{monster.type}, {monster.alignment}</p>
                            </div>

                            <div className="space-y-2 mb-6 text-[#922610]">
                                <p><strong>Armor Class</strong> {monster.ac}</p>
                                <p><strong>Hit Points</strong> {monster.hp}</p>
                                <p><strong>Speed</strong> {monster.speed}</p>
                            </div>

                            <div className="border-t-2 border-b-2 border-[#922610] py-4 mb-6">
                                <div className="grid grid-cols-6 gap-2 text-center">
                                    <StatBlock label="STR" value={monster.str} />
                                    <StatBlock label="DEX" value={monster.dex} />
                                    <StatBlock label="CON" value={monster.con} />
                                    <StatBlock label="INT" value={monster.int} />
                                    <StatBlock label="WIS" value={monster.wis} />
                                    <StatBlock label="CHA" value={monster.cha} />
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                {monster.skills && <p><strong>Skills</strong> {monster.skills}</p>}
                                {monster.senses && <p><strong>Senses</strong> {monster.senses}</p>}
                                {monster.languages && <p><strong>Languages</strong> {monster.languages}</p>}
                                <p><strong>Challenge</strong> {monster.challenge}</p>
                            </div>

                            <div className="border-b-2 border-[#922610] mb-6" />

                            <div className="space-y-6">
                                {monster.traits && monster.traits.map((trait, i) => (
                                    <div key={i}>
                                        <span className="font-bold italic text-[#922610]">{trait.name}.</span> {trait.description}
                                    </div>
                                ))}

                                {monster.actions && monster.actions.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Actions</h3>
                                        <div className="space-y-4">
                                            {monster.actions.map((action, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{action.name}.</span> {action.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {monster.legendaryActions && monster.legendaryActions.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Legendary Actions</h3>
                                        <div className="space-y-4">
                                            {monster.legendaryActions.map((action, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{action.name}.</span> {action.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'NOTES' && (
                    <div className="h-full p-8 max-w-4xl mx-auto flex flex-col">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col h-full shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <span>📝</span> Notas sobre {monster.name}
                            </h2>
                            <p className="text-zinc-400 mb-6">
                                Use este espaço para anotar táticas, loot específico, ou modificações para sua campanha.
                                Essas notas são salvas automaticamente.
                            </p>
                            <div className="flex-1 bg-zinc-950 rounded-lg border border-zinc-700 overflow-hidden">
                                <TiptapEditor
                                    content={savedNote}
                                    onChange={onSaveNote}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
