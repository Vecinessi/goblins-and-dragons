import { useState } from 'react';
import type { Monster, MonsterAction, CreatureType, CreatureSize, Alignment } from '../../../types';

interface MonsterFormProps {
    monster?: Monster;
    onSave: (monster: Monster) => void;
    onCancel: () => void;
}

const CREATURE_TYPES: CreatureType[] = [
    'Aberração', 'Besta', 'Celestial', 'Constructo', 'Corruptor',
    'Dragão', 'Elemental', 'Fada', 'Gigante', 'Humanoide',
    'Limo', 'Monstruosidade', 'Planta', 'Morto-Vivo', 'Outro'
];

const SIZES: CreatureSize[] = ['Miúdo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Imenso'];

const ALIGNMENTS: { value: Alignment; label: string }[] = [
    { value: 'LB', label: 'Leal e Bom' },
    { value: 'NB', label: 'Neutro e Bom' },
    { value: 'CB', label: 'Caótico e Bom' },
    { value: 'LN', label: 'Leal e Neutro' },
    { value: 'N', label: 'Neutro' },
    { value: 'CN', label: 'Caótico e Neutro' },
    { value: 'LM', label: 'Leal e Mau' },
    { value: 'NM', label: 'Neutro e Mau' },
    { value: 'CM', label: 'Caótico e Mau' },
];

const ALL_SKILLS = [
    'Acrobacia', 'Adestrar Animais', 'Arcanismo', 'Atletismo',
    'Enganação', 'História', 'Intuição', 'Intimidação',
    'Investigação', 'Medicina', 'Natureza', 'Percepção',
    'Performance', 'Persuasão', 'Prestidigitação', 'Religião',
    'Furtividade', 'Sobrevivência'
];

const createDefaultMonster = (): Monster => ({
    id: '',
    name: '',
    type: 'Humanoide',
    size: 'Médio',
    alignment: 'N',
    ac: 10,
    hp: 10,
    speed: { walk: 9 },
    cr: 0,
    passivePerception: 10,
    attributes: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skills: {},
    senses: null,
    resistances: [],
    immunities: [],
    loot: null,
    languages: null,
    traits: [],
    actions: [],
    reactions: [],
    legendaryActions: [],
    regionalEffects: [],
});

// Reusable sub-component for {name, description}[] fields
function ActionListEditor({ label, items, onChange }: {
    label: string;
    items: MonsterAction[];
    onChange: (items: MonsterAction[]) => void;
}) {
    const addItem = () => onChange([...items, { name: '', description: '' }]);
    const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: 'name' | 'description', value: string) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        onChange(updated);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-zinc-300">{label}</label>
                <button type="button" onClick={addItem}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition">
                    + Adicionar
                </button>
            </div>
            {items.length === 0 && (
                <p className="text-xs text-zinc-500 italic">Nenhum item adicionado.</p>
            )}
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nome"
                                value={item.name}
                                onChange={(e) => updateItem(i, 'name', e.target.value)}
                                className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-1.5 rounded outline-none focus:border-purple-500 transition text-sm"
                            />
                            <button type="button" onClick={() => removeItem(i)}
                                className="text-red-400 hover:text-red-300 text-sm px-2 transition">
                                ✕
                            </button>
                        </div>
                        <textarea
                            placeholder="Descrição"
                            value={item.description}
                            onChange={(e) => updateItem(i, 'description', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white px-3 py-1.5 rounded outline-none focus:border-purple-500 transition text-sm resize-y min-h-[60px]"
                            rows={2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Reusable sub-component for string[] fields
function StringArrayEditor({ label, items, onChange, placeholder }: {
    label: string;
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}) {
    const [newItem, setNewItem] = useState('');
    const addItem = () => {
        if (newItem.trim()) {
            onChange([...items, newItem.trim()]);
            setNewItem('');
        }
    };
    const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));

    return (
        <div>
            <label className="block text-sm font-bold text-zinc-300 mb-2">{label}</label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
                    placeholder={placeholder || 'Adicionar...'}
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-3 py-1.5 rounded-lg outline-none focus:border-purple-500 transition text-sm"
                />
                <button type="button" onClick={addItem}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition">
                    +
                </button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-2 py-1 rounded-lg flex items-center gap-1 border border-zinc-700">
                            {item}
                            <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 ml-1">✕</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function MonsterForm({ monster, onSave, onCancel }: MonsterFormProps) {
    const [formData, setFormData] = useState<Monster>(() => {
        return monster ? { ...monster } : createDefaultMonster();
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalMonster: Monster = {
            ...formData,
            id: monster?.id || crypto.randomUUID()
        };
        onSave(finalMonster);
    };

    const updateField = <K extends keyof Monster>(field: K, value: Monster[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateAttribute = (attr: keyof Monster['attributes'], value: number) => {
        setFormData(prev => ({
            ...prev,
            attributes: { ...prev.attributes, [attr]: value }
        }));
    };

    const updateSpeed = (key: keyof Monster['speed'], value: string) => {
        const num = parseInt(value);
        setFormData(prev => {
            const newSpeed = { ...prev.speed };
            if (isNaN(num) || num <= 0) {
                delete newSpeed[key];
            } else {
                newSpeed[key] = num;
            }
            return { ...prev, speed: newSpeed };
        });
    };

    const toggleSkill = (skillName: string) => {
        setFormData(prev => {
            const newSkills = { ...prev.skills };
            if (skillName in newSkills) {
                delete newSkills[skillName];
            } else {
                newSkills[skillName] = 0;
            }
            return { ...prev, skills: newSkills };
        });
    };

    const updateSkillBonus = (skillName: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            skills: { ...prev.skills, [skillName]: value }
        }));
    };

    // Shared CSS classes
    const inputClass = "w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition";
    const labelClass = "block text-sm font-bold text-zinc-300 mb-2";

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
                <h2 className="text-2xl font-bold text-white">
                    {monster ? 'Editar Monstro' : 'Criar Novo Monstro'}
                </h2>
                <button onClick={onCancel} className="text-zinc-400 hover:text-white transition">
                    ✕ Cancelar
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* === SEÇÃO 1: Identificação === */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">📋 Identificação</h3>

                        {/* Nome */}
                        <div>
                            <label className={labelClass}>Nome *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className={inputClass}
                                placeholder="Ex: Goblin Guerreiro"
                            />
                        </div>

                        {/* Tipo e Tamanho */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Tipo</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => updateField('type', e.target.value as CreatureType)}
                                    className={inputClass}
                                >
                                    {CREATURE_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Tamanho</label>
                                <select
                                    value={formData.size}
                                    onChange={(e) => updateField('size', e.target.value as CreatureSize)}
                                    className={inputClass}
                                >
                                    {SIZES.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Alinhamento */}
                        <div>
                            <label className={labelClass}>Alinhamento</label>
                            <select
                                value={formData.alignment}
                                onChange={(e) => updateField('alignment', e.target.value as Alignment)}
                                className={inputClass}
                            >
                                {ALIGNMENTS.map(a => (
                                    <option key={a.value} value={a.value}>{a.label} ({a.value})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* === SEÇÃO 2: Estatísticas de Combate === */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">⚔️ Combate</h3>

                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className={labelClass}>CA</label>
                                <input
                                    type="number"
                                    value={formData.ac}
                                    onChange={(e) => updateField('ac', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>HP</label>
                                <input
                                    type="number"
                                    value={formData.hp}
                                    onChange={(e) => updateField('hp', parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>ND</label>
                                <input
                                    type="number"
                                    step="0.125"
                                    min="0"
                                    value={formData.cr}
                                    onChange={(e) => updateField('cr', parseFloat(e.target.value) || 0)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Percepção Passiva</label>
                                <input
                                    type="number"
                                    value={formData.passivePerception}
                                    onChange={(e) => updateField('passivePerception', parseInt(e.target.value) || 10)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Velocidade */}
                        <div>
                            <label className={labelClass}>Velocidade (em ft.)</label>
                            <div className="grid grid-cols-5 gap-3">
                                {([
                                    ['walk', 'Caminhada'],
                                    ['burrow', 'Escavação'],
                                    ['climb', 'Escalada'],
                                    ['fly', 'Voo'],
                                    ['swim', 'Natação'],
                                ] as const).map(([key, label]) => (
                                    <div key={key}>
                                        <label className="block text-xs text-zinc-500 mb-1">{label}</label>
                                        <input
                                            type="number"
                                            value={formData.speed[key] ?? ''}
                                            onChange={(e) => updateSpeed(key, e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 text-white px-2 py-1.5 rounded-lg outline-none focus:border-purple-500 transition text-center text-sm"
                                            placeholder="-"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* === SEÇÃO 3: Atributos === */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-purple-400 mb-4">🎲 Atributos</h3>
                        <div className="grid grid-cols-6 gap-3">
                            {([
                                ['str', 'FOR'], ['dex', 'DES'], ['con', 'CON'],
                                ['int', 'INT'], ['wis', 'SAB'], ['cha', 'CAR']
                            ] as const).map(([key, label]) => {
                                const score = formData.attributes[key];
                                const mod = Math.floor((score - 10) / 2);
                                return (
                                    <div key={key} className="text-center">
                                        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">{label}</label>
                                        <input
                                            type="number"
                                            value={score}
                                            onChange={(e) => updateAttribute(key, parseInt(e.target.value) || 10)}
                                            className="w-full bg-zinc-900 border border-zinc-700 text-white px-2 py-2 rounded-lg outline-none focus:border-purple-500 transition text-center"
                                        />
                                        <span className="text-xs text-zinc-500 mt-1 block">
                                            {mod >= 0 ? `+${mod}` : mod}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* === SEÇÃO 4: Perícias === */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-purple-400 mb-4">📚 Perícias</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {ALL_SKILLS.map(skill => {
                                const isActive = skill in formData.skills;
                                return (
                                    <div key={skill} className={`flex items-center gap-2 p-2 rounded-lg border transition ${isActive ? 'bg-purple-900/30 border-purple-600' : 'bg-zinc-900/50 border-zinc-700'}`}>
                                        <input
                                            type="checkbox"
                                            checked={isActive}
                                            onChange={() => toggleSkill(skill)}
                                            className="accent-purple-600"
                                        />
                                        <span className={`text-sm flex-1 ${isActive ? 'text-white' : 'text-zinc-500'}`}>{skill}</span>
                                        {isActive && (
                                            <input
                                                type="number"
                                                value={formData.skills[skill]}
                                                onChange={(e) => updateSkillBonus(skill, parseInt(e.target.value) || 0)}
                                                className="w-14 bg-zinc-900 border border-zinc-600 text-white px-1 py-0.5 rounded text-center text-sm"
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* === SEÇÃO 5: Defesas & Info === */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-4">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">🛡️ Defesas & Informações</h3>

                        <StringArrayEditor
                            label="Resistências"
                            items={formData.resistances}
                            onChange={(items) => updateField('resistances', items)}
                            placeholder="Ex: Fogo, Gelo..."
                        />

                        <StringArrayEditor
                            label="Imunidades"
                            items={formData.immunities}
                            onChange={(items) => updateField('immunities', items)}
                            placeholder="Ex: Veneno, Encantado..."
                        />

                        <div>
                            <label className={labelClass}>Sentidos</label>
                            <input
                                type="text"
                                value={formData.senses ?? ''}
                                onChange={(e) => updateField('senses', e.target.value || null)}
                                className={inputClass}
                                placeholder="Ex: Visão no escuro 30 metros."
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Idiomas</label>
                            <input
                                type="text"
                                value={formData.languages ?? ''}
                                onChange={(e) => updateField('languages', e.target.value || null)}
                                className={inputClass}
                                placeholder="Ex: Comum, Goblin"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Espólios</label>
                            <input
                                type="text"
                                value={formData.loot ?? ''}
                                onChange={(e) => updateField('loot', e.target.value || null)}
                                className={inputClass}
                                placeholder="Ex: 2d6 moedas de ouro"
                            />
                        </div>
                    </div>

                    {/* === SEÇÃO 6: Habilidades === */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-6">
                        <h3 className="text-lg font-bold text-purple-400 mb-2">✨ Habilidades</h3>

                        <ActionListEditor
                            label="Características"
                            items={formData.traits}
                            onChange={(items) => updateField('traits', items)}
                        />

                        <ActionListEditor
                            label="Ações"
                            items={formData.actions}
                            onChange={(items) => updateField('actions', items)}
                        />

                        <ActionListEditor
                            label="Reações"
                            items={formData.reactions}
                            onChange={(items) => updateField('reactions', items)}
                        />

                        <ActionListEditor
                            label="Ações Lendárias"
                            items={formData.legendaryActions}
                            onChange={(items) => updateField('legendaryActions', items)}
                        />

                        <ActionListEditor
                            label="Efeitos Regionais"
                            items={formData.regionalEffects}
                            onChange={(items) => updateField('regionalEffects', items)}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-zinc-800">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition"
                        >
                            {monster ? 'Salvar Alterações' : 'Criar Monstro'}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
