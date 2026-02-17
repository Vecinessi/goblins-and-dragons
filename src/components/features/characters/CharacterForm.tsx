
import { useState } from 'react';
import type { Character } from '../../../types';

interface CharacterFormProps {
    initialData?: Character;
    onSave: (character: Omit<Character, 'id'> | Character) => void;
    onCancel: () => void;
}

const RACES = ['Humano', 'Elfo', 'Anão', 'Halfling', 'Draconato', 'Tiefling', 'Gnomo', 'Meio-Elfo', 'Meio-Orc'];
const CLASSES = ['Guerreiro', 'Mago', 'Ladino', 'Clérigo', 'Bardo', 'Druida', 'Monge', 'Paladino', 'Ranger', 'Feiticeiro', 'Bruxo', 'Bárbaro'];

export function CharacterForm({ initialData, onSave, onCancel }: CharacterFormProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Character>>(initialData || {
        name: '',
        race: '',
        class: '',
        level: 1,
        currentHp: 10,
        maxHp: 10,
        armorClass: 10,
        image: '',
        token: '',
        biography: '',
        notes: ''
    });

    const handleChange = (field: keyof Character, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(prev => prev + 1);
        } else {
            // Validate
            if (!formData.name || !formData.race || !formData.class) return;
            onSave(formData as Character);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900 text-white p-6 max-w-4xl mx-auto w-full animate-fade-in">
            {/* Header / Steps */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                    {initialData ? 'Editar Personagem' : 'Criar Novo Personagem'}
                </h2>
                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-500' : 'text-zinc-600'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-orange-500 bg-orange-500/20' : 'border-zinc-700'}`}>1</span>
                        Origem
                    </div>
                    <div className="w-8 h-px bg-zinc-700" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-500' : 'text-zinc-600'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-orange-500 bg-orange-500/20' : 'border-zinc-700'}`}>2</span>
                        Informações
                    </div>
                    <div className="w-8 h-px bg-zinc-700" />
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-500' : 'text-zinc-600'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'border-orange-500 bg-orange-500/20' : 'border-zinc-700'}`}>3</span>
                        História
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1">
                    {step === 1 && (
                        <div className="space-y-6 animate-slide-up">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* RAÇA */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">Raça</label>
                                    <input
                                        type="text"
                                        list="races-list"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-white placeholder-zinc-500 transition"
                                        placeholder="Ex: Humano, Elfo..."
                                        value={formData.race}
                                        onChange={(e) => handleChange('race', e.target.value)}
                                        autoFocus
                                    />
                                    <datalist id="races-list">
                                        {RACES.map(r => <option key={r} value={r} />)}
                                    </datalist>
                                    <p className="text-xs text-zinc-500">Selecione uma raça padrão ou digite uma personalizada.</p>
                                </div>

                                {/* CLASSE */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">Classe</label>
                                    <input
                                        type="text"
                                        list="classes-list"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-white placeholder-zinc-500 transition"
                                        placeholder="Ex: Guerreiro, Mago..."
                                        value={formData.class}
                                        onChange={(e) => handleChange('class', e.target.value)}
                                    />
                                    <datalist id="classes-list">
                                        {CLASSES.map(c => <option key={c} value={c} />)}
                                    </datalist>
                                    <p className="text-xs text-zinc-500">Selecione uma classe padrão ou digite uma personalizada.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-slide-up">
                            {/* NOME E NÍVEL */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-3 space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">Nome do Personagem</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none"
                                        placeholder="Digite o nome aqui"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">Nível</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none"
                                        value={formData.level}
                                        onChange={(e) => handleChange('level', Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* STATS */}
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">HP Atual</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none"
                                        value={formData.currentHp}
                                        onChange={(e) => handleChange('currentHp', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">Max HP</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none"
                                        value={formData.maxHp}
                                        onChange={(e) => handleChange('maxHp', Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-zinc-400">Classe de Armadura</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none"
                                        value={formData.armorClass}
                                        onChange={(e) => handleChange('armorClass', Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* IMAGEM E TOKEN */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                <div
                                    className="aspect-square bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-zinc-800/50 transition group relative overflow-hidden"
                                    onClick={() => {
                                        // Simples mock de upload por enquanto - pedir URL
                                        const url = prompt('Cole a URL da imagem do personagem:');
                                        if (url) handleChange('image', url);
                                    }}
                                >
                                    {formData.image ? (
                                        <img src={formData.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center mb-2 group-hover:bg-orange-500 transition text-2xl">+</div>
                                            <span className="text-zinc-400 font-medium">Subir Imagem</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-center">
                                    <div className="w-48 h-48 rounded-full bg-zinc-950 border-4 border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
                                        {formData.image ? (
                                            <img src={formData.image} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-zinc-600">Token</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-slide-up h-full flex flex-col">
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-bold text-zinc-400 mb-2">História (Bio)</label>
                                    <textarea
                                        className="w-full flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none resize-none"
                                        placeholder="Escreva a história do personagem..."
                                        value={formData.biography}
                                        onChange={(e) => handleChange('biography', e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-bold text-zinc-400 mb-2">Notas Importantes</label>
                                    <textarea
                                        className="w-full flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-lg focus:border-orange-500 outline-none resize-none"
                                        placeholder="Adicione notas, segredos e observações..."
                                        value={formData.notes}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-zinc-800 pt-6 flex justify-end gap-3 mt-6">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={() => setStep(prev => prev - 1)}
                            className="px-6 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                            Voltar
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        >
                            Cancelar
                        </button>
                    )}

                    <button
                        type="submit"
                        className="px-8 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition shadow-lg shadow-orange-900/20"
                    >
                        {step === 3 ? 'Salvar Personagem' : 'Próximo'}
                    </button>
                </div>
            </form>
        </div>
    );
}
