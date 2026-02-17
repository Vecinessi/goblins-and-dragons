import { useState } from 'react';
import type { Monster } from '../../../types';
import { NoteEditor as TiptapEditor } from '../notes/NoteEditor';

interface MonsterSheetProps {
    monster: Monster;
    onClose: () => void;
    savedNote: string;
    onSaveNote: (note: string) => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const ALIGNMENT_LABELS: Record<string, string> = {
    'LB': 'Leal e Bom', 'NB': 'Neutro e Bom', 'CB': 'Caótico e Bom',
    'LN': 'Leal e Neutro', 'N': 'Neutro', 'CN': 'Caótico e Neutro',
    'LM': 'Leal e Mau', 'NM': 'Neutro e Mau', 'CM': 'Caótico e Mau'
};

export function MonsterSheet({ monster, onClose, savedNote, onSaveNote, onEdit, onDelete }: MonsterSheetProps) {
    const [activeTab, setActiveTab] = useState<'STATS' | 'NOTES'>('STATS');

    const getMod = (score: number, attr?: string) => {
        // Use custom modifier if available
        if (attr && monster.customModifiers) {
            const custom = monster.customModifiers[attr as keyof typeof monster.customModifiers];
            if (custom !== undefined) return custom >= 0 ? `+${custom}` : `${custom}`;
        }
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    const StatBlock = ({ label, value, attr }: { label: string; value: number; attr: string }) => (
        <div className="flex flex-col items-center bg-zinc-800/50 p-2 rounded lg:w-16">
            <span className="text-xs text-zinc-500 uppercase font-bold">{label}</span>
            <span className="text-lg font-bold text-white">{value}</span>
            <span className="text-xs text-zinc-400">{getMod(value, attr)}</span>
        </div>
    );

    // Format speed object to readable string
    const formatSpeed = (speed: Monster['speed']) => {
        const parts: string[] = [];
        if (speed.walk) parts.push(`${speed.walk} ft.`);
        if (speed.burrow) parts.push(`escavar ${speed.burrow} ft.`);
        if (speed.climb) parts.push(`escalar ${speed.climb} ft.`);
        if (speed.fly) parts.push(`voo ${speed.fly} ft.`);
        if (speed.swim) parts.push(`nadar ${speed.swim} ft.`);
        return parts.join(', ') || '0 ft.';
    };

    // Format skills object to readable string
    const formatSkills = (skills: Record<string, number>) => {
        const entries = Object.entries(skills);
        if (entries.length === 0) return null;
        return entries.map(([name, bonus]) => `${name} +${bonus}`).join(', ');
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
                    {!onEdit && !onDelete && <div className="w-20" />}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                {activeTab === 'STATS' && (
                    <div className="max-w-4xl mx-auto p-8">
                        <div className="bg-[#e0d3b8] text-[#2c1b11] font-serif p-8 rounded-sm shadow-2xl relative overflow-hidden border-4 border-[#2c1b11] double-border">
                            {/* Title */}
                            <div className="border-b-2 border-[#922610] mb-4 pb-2">
                                <h1 className="text-4xl font-bold uppercase tracking-wider text-[#922610]">{monster.name}</h1>
                                <p className="text-lg italic font-semibold">
                                    {monster.size} {monster.type}, {ALIGNMENT_LABELS[monster.alignment] || monster.alignment}
                                </p>
                            </div>

                            {/* Core Stats */}
                            <div className="space-y-2 mb-6 text-[#922610]">
                                <p><strong>Classe de Armadura</strong> {monster.ac}</p>
                                <p><strong>Pontos de Vida</strong> {monster.hp}</p>
                                <p><strong>Velocidade</strong> {formatSpeed(monster.speed)}</p>
                            </div>

                            {/* Attributes */}
                            <div className="border-t-2 border-b-2 border-[#922610] py-4 mb-6">
                                <div className="grid grid-cols-6 gap-2 text-center">
                                    <StatBlock label="FOR" value={monster.attributes.str} attr="str" />
                                    <StatBlock label="DES" value={monster.attributes.dex} attr="dex" />
                                    <StatBlock label="CON" value={monster.attributes.con} attr="con" />
                                    <StatBlock label="INT" value={monster.attributes.int} attr="int" />
                                    <StatBlock label="SAB" value={monster.attributes.wis} attr="wis" />
                                    <StatBlock label="CAR" value={monster.attributes.cha} attr="cha" />
                                </div>
                            </div>

                            {/* Secondary Info */}
                            <div className="space-y-2 mb-6">
                                {formatSkills(monster.skills) && (
                                    <p><strong>Perícias</strong> {formatSkills(monster.skills)}</p>
                                )}
                                {monster.resistances.length > 0 && (
                                    <p><strong>Resistências</strong> {monster.resistances.join(', ')}</p>
                                )}
                                {monster.immunities.length > 0 && (
                                    <p><strong>Imunidades</strong> {monster.immunities.join(', ')}</p>
                                )}
                                {monster.senses && <p><strong>Sentidos</strong> {monster.senses}</p>}
                                {monster.languages && <p><strong>Idiomas</strong> {monster.languages}</p>}
                                <p><strong>Nível de Desafio</strong> {monster.cr}</p>
                                <p><strong>Percepção Passiva</strong> {monster.passivePerception}</p>
                                {monster.loot && <p><strong>Espólios</strong> {monster.loot}</p>}
                            </div>

                            <div className="border-b-2 border-[#922610] mb-6" />

                            {/* Traits, Actions, Reactions, Legendary Actions, Regional Effects */}
                            <div className="space-y-6">
                                {monster.traits.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Características</h3>
                                        <div className="space-y-4">
                                            {monster.traits.map((trait, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{trait.name}.</span> {trait.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {monster.actions.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Ações</h3>
                                        <div className="space-y-4">
                                            {monster.actions.map((action, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{action.name}.</span> {action.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {monster.reactions.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Reações</h3>
                                        <div className="space-y-4">
                                            {monster.reactions.map((reaction, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{reaction.name}.</span> {reaction.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {monster.legendaryActions.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Ações Lendárias</h3>
                                        <div className="space-y-4">
                                            {monster.legendaryActions.map((action, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{action.name}.</span> {action.description}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {monster.regionalEffects.length > 0 && (
                                    <div>
                                        <h3 className="text-2xl border-b border-[#922610] text-[#922610] mb-4 font-bold">Efeitos Regionais</h3>
                                        <div className="space-y-4">
                                            {monster.regionalEffects.map((effect, i) => (
                                                <div key={i}>
                                                    <span className="font-bold italic text-[#922610]">{effect.name}.</span> {effect.description}
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
