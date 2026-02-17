import { useState } from 'react';
import type { WindowState } from '../../../types';
import { useWindowPosition } from '../../../hooks/useWindowPosition';

type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

interface DiceRow {
    type: DiceType;
    label: string;
}

const DICE_TYPES: DiceRow[] = [
    { type: 'd4', label: 'd4' },
    { type: 'd6', label: 'd6' },
    { type: 'd8', label: 'd8' },
    { type: 'd10', label: 'd10' },
    { type: 'd12', label: 'd12' },
    { type: 'd20', label: 'd20' },
    { type: 'd100', label: 'd100' },
];

interface DiceState {
    qty: number;
    mod: number | string;
    result: string | number | null;
}

interface DiceRollerProps {
    windowState: WindowState;
    notesState?: WindowState;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
}

export function DiceRoller({ windowState, notesState = 'CLOSED', onClose, onMinimize, onMaximize }: DiceRollerProps) {
    const [rolls, setRolls] = useState<Record<DiceType, DiceState>>(() => {
        const initial: any = {};
        DICE_TYPES.forEach(d => {
            initial[d.type] = { qty: 1, mod: 0, result: null };
        });
        return initial;
    });

    const { windowRef, style, handleMouseDown, isMinimized } = useWindowPosition({
        windowState,
        initialPosition: { x: window.innerWidth / 2 - 250, y: 100 }
    });

    const updateState = (type: DiceType, field: keyof DiceState, value: any) => {
        setRolls(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    const rollDice = (type: DiceType) => {
        const { qty, mod } = rolls[type];
        const sides = type === 'd100' ? 100 : parseInt(type.substring(1));
        const modifier = typeof mod === 'string' ? (parseInt(mod) || 0) : mod;

        let total = 0;
        // let details = []; // details not used in UI yet

        for (let i = 0; i < qty; i++) {
            const val = Math.floor(Math.random() * sides) + 1;
            total += val;
            // details.push(val);
        }

        const finalResult = total + modifier;
        updateState(type, 'result', finalResult);
    };

    const resetAll = () => {
        const reset: any = {};
        DICE_TYPES.forEach(d => {
            reset[d.type] = { qty: 1, mod: 0, result: null };
        });
        setRolls(reset);
    };

    if (windowState === 'CLOSED') return null;

    return (
        <div className={`fixed z-[60] pointer-events-none ${isMinimized ? 'inset-x-0 bottom-0 flex justify-end px-0' : 'inset-0'}`}>
            <div
                ref={windowRef}
                style={style}
                className={`
          pointer-events-auto bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden flex flex-col ease-in-out
          ${isMinimized
                        ? `fixed bottom-0 ${notesState === 'MINIMIZED' ? 'right-80' : notesState === 'OPEN' ? 'right-[850px]' : 'right-4'} w-64 h-12 rounded-t-lg border-b-0`
                        : 'absolute w-[500px] rounded-xl top-0 left-0'
                    }
        `}
            >
                <div
                    onMouseDown={handleMouseDown}
                    onClick={isMinimized ? onMaximize : undefined}
                    className={`
            flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-800 select-none transition-colors
            ${isMinimized ? 'cursor-pointer hover:bg-zinc-700 h-full border-none' : 'cursor-move active:bg-zinc-700'}
          `}
                >
                    <div className="flex items-center gap-2 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h10zM3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3z" />
                            <path d="M5.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg>
                        <h3 className="font-bold text-sm text-white">Dados</h3>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); isMinimized ? onMaximize() : onMinimize(); }}
                            className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-zinc-600/50"
                        >
                            {isMinimized ? '🔼' : '➖'}
                        </button>

                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-red-900/50 hover:text-red-200"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <div className="p-4 bg-zinc-900/95">
                        <div className="grid grid-cols-[60px_1fr_1fr_100px_60px] gap-3 mb-2 text-xs font-bold text-gray-400 text-center uppercase tracking-wider items-center">
                            <span>Dado</span>
                            <span>Qtd</span>
                            <span>Mod.</span>
                            <span>Ação</span>
                            <span>Res.</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {DICE_TYPES.map((d) => (
                                <div key={d.type} className="grid grid-cols-[60px_1fr_1fr_100px_60px] gap-3 items-center">
                                    <div className="font-bold text-zinc-400 text-center text-sm bg-zinc-800 py-1.5 rounded border border-zinc-700 select-none">
                                        {d.label}
                                    </div>

                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full bg-zinc-950 text-white font-bold text-center rounded py-1.5 border border-zinc-700 outline-none focus:border-orange-500 transition-colors"
                                        value={rolls[d.type].qty}
                                        onChange={(e) => updateState(d.type, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                                    />

                                    <input
                                        type="text"
                                        className="w-full bg-zinc-950 text-white font-bold text-center rounded py-1.5 border border-zinc-700 outline-none focus:border-orange-500 transition-colors"
                                        value={rolls[d.type].mod}
                                        onChange={(e) => updateState(d.type, 'mod', e.target.value)}
                                    />

                                    <button
                                        onClick={() => rollDice(d.type)}
                                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-1.5 rounded transition text-xs uppercase tracking-wide shadow-lg shadow-orange-900/20 active:translate-y-0.5 flex items-center justify-center"
                                    >
                                        Rolar
                                    </button>

                                    <div className="text-white font-bold text-center text-sm min-h-[32px] flex items-center justify-center bg-zinc-800/30 rounded border border-zinc-700/50">
                                        {rolls[d.type].result ?? '-'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={resetAll}
                            className="mt-6 w-[100px] border border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white font-bold py-2 rounded text-sm flex items-center justify-center gap-2 transition shadow-lg"
                        >
                            ↺ Resetar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
