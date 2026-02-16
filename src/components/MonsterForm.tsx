import { useState, useEffect } from 'react';
import type { Monster } from '../types';

interface MonsterFormProps {
    monster?: Monster;
    onSave: (monster: Monster) => void;
    onCancel: () => void;
}

const CREATURE_TYPES = [
    'Aberração',
    'Besta',
    'Celestial',
    'Constructo',
    'Dragão',
    'Elemental',
    'Feérico',
    'Corruptor',
    'Gigante',
    'Humanoide',
    'Limo',
    'Monstruosidade',
    'Planta',
    'Morto-Vivo'
];

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

export function MonsterForm({ monster, onSave, onCancel }: MonsterFormProps) {
    const [formData, setFormData] = useState<Monster>(() => {
        if (monster) return monster;

        return {
            id: '',
            name: '',
            type: 'Medium Humanoide',
            alignment: 'Unaligned',
            ac: 10,
            hp: '10 (2d8)',
            speed: '30 ft.',
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10,
            skills: '',
            senses: 'passive Perception 10',
            languages: 'Common',
            challenge: '0',
            traits: [],
            actions: []
        };
    });

    const [selectedSize, setSelectedSize] = useState(monster?.type.split(' ')[0] || 'Medium');
    const [selectedType, setSelectedType] = useState(monster?.type.split(' ')[1]?.split('(')[0]?.trim() || 'Humanoide');

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            type: `${selectedSize} ${selectedType}`
        }));
    }, [selectedSize, selectedType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalMonster = {
            ...formData,
            id: monster?.id || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')
        };

        onSave(finalMonster);
    };

    const handleChange = (field: keyof Monster, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900">
                <h2 className="text-2xl font-bold text-white">
                    {monster ? 'Editar Monstro' : 'Criar Novo Monstro'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-zinc-400 hover:text-white transition"
                >
                    ✕ Cancelar
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Nome *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                            placeholder="Ex: Goblin Guerreiro"
                        />
                    </div>

                    {/* Tamanho e Tipo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Tamanho</label>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                            >
                                {SIZES.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Tipo</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                            >
                                {CREATURE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Alinhamento */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Alinhamento</label>
                        <input
                            type="text"
                            value={formData.alignment}
                            onChange={(e) => handleChange('alignment', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                            placeholder="Ex: Chaotic Evil"
                        />
                    </div>

                    {/* CA, HP, Velocidade */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">CA (AC)</label>
                            <input
                                type="number"
                                value={formData.ac}
                                onChange={(e) => handleChange('ac', parseInt(e.target.value))}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">HP</label>
                            <input
                                type="text"
                                value={formData.hp}
                                onChange={(e) => handleChange('hp', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                                placeholder="Ex: 22 (4d8+4)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Velocidade</label>
                            <input
                                type="text"
                                value={formData.speed}
                                onChange={(e) => handleChange('speed', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                                placeholder="Ex: 30 ft., fly 60 ft."
                            />
                        </div>
                    </div>

                    {/* Atributos */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-3">Atributos</h3>
                        <div className="grid grid-cols-6 gap-3">
                            {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((attr) => (
                                <div key={attr}>
                                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                                        {attr}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData[attr as keyof Monster] as number}
                                        onChange={(e) => handleChange(attr as keyof Monster, parseInt(e.target.value))}
                                        className="w-full bg-zinc-900 border border-zinc-700 text-white px-2 py-2 rounded-lg outline-none focus:border-purple-500 transition text-center"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills, Sentidos, Idiomas */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Perícias (Skills)</label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) => handleChange('skills', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                                placeholder="Ex: Stealth +6, Perception +4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Sentidos</label>
                            <input
                                type="text"
                                value={formData.senses}
                                onChange={(e) => handleChange('senses', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                                placeholder="Ex: Darkvision 60 ft., passive Perception 12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-2">Idiomas</label>
                            <input
                                type="text"
                                value={formData.languages}
                                onChange={(e) => handleChange('languages', e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                                placeholder="Ex: Common, Goblin"
                            />
                        </div>
                    </div>

                    {/* Challenge Rating */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-2">Challenge Rating (CR)</label>
                        <input
                            type="text"
                            value={formData.challenge}
                            onChange={(e) => handleChange('challenge', e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg outline-none focus:border-purple-500 transition"
                            placeholder="Ex: 1/4, 1, 5, 20"
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
