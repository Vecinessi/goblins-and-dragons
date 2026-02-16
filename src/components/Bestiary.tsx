import { useState } from 'react';
import { MonsterList } from './MonsterList';
import { MonsterSheet } from './MonsterSheet';
import { MonsterForm } from './MonsterForm';
import { MONSTERS } from '../data/monsters';
import type { Monster } from '../types';

interface BestiaryProps {
    savedNotes: Record<string, string>;
    onSaveNote: (monsterId: string, content: string) => void;
    customMonsters: Monster[];
    onSaveMonster: (monster: Monster) => void;
    onDeleteMonster: (id: string) => void;
}

type ViewMode = 'LIST' | 'SHEET' | 'CREATE' | 'EDIT';

export function Bestiary({ savedNotes, onSaveNote, customMonsters, onSaveMonster, onDeleteMonster }: BestiaryProps) {
    const [view, setView] = useState<ViewMode>('LIST');
    const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

    // Combine default monsters with custom ones
    const allMonsters = [...MONSTERS, ...customMonsters];

    const handleSelectMonster = (monster: Monster) => {
        setSelectedMonster(monster);
        setView('SHEET');
    };

    const handleCloseSheet = () => {
        setSelectedMonster(null);
        setView('LIST');
    };

    const handleCreateNew = () => {
        setSelectedMonster(null);
        setView('CREATE');
    };

    const handleEdit = () => {
        if (selectedMonster) {
            setView('EDIT');
        }
    };

    const handleSaveMonster = (monster: Monster) => {
        onSaveMonster(monster);
        setView('LIST');
        setSelectedMonster(null);
    };

    const handleCancelForm = () => {
        setView('LIST');
        setSelectedMonster(null);
    };

    const handleDelete = () => {
        if (selectedMonster && confirm(`Tem certeza que deseja excluir "${selectedMonster.name}"?`)) {
            onDeleteMonster(selectedMonster.id);
            setView('LIST');
            setSelectedMonster(null);
        }
    };

    // Check if current monster is custom (can be edited/deleted)
    const isCustomMonster = selectedMonster && customMonsters.some(m => m.id === selectedMonster.id);

    return (
        <div className="h-full w-full bg-zinc-950">
            {view === 'LIST' && (
                <MonsterList
                    monsters={allMonsters}
                    onSelect={handleSelectMonster}
                    savedNotes={savedNotes}
                    onCreateNew={handleCreateNew}
                />
            )}

            {view === 'SHEET' && selectedMonster && (
                <MonsterSheet
                    monster={selectedMonster}
                    onClose={handleCloseSheet}
                    savedNote={savedNotes[selectedMonster.id] || ''}
                    onSaveNote={(content) => onSaveNote(selectedMonster.id, content)}
                    onEdit={isCustomMonster ? handleEdit : undefined}
                    onDelete={isCustomMonster ? handleDelete : undefined}
                />
            )}

            {(view === 'CREATE' || view === 'EDIT') && (
                <MonsterForm
                    monster={view === 'EDIT' ? selectedMonster || undefined : undefined}
                    onSave={handleSaveMonster}
                    onCancel={handleCancelForm}
                />
            )}
        </div>
    );
}
