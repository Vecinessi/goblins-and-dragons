export type WindowState = 'CLOSED' | 'OPEN' | 'MINIMIZED';

export interface Character {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
    currentHp: number;
    maxHp: number;
    armorClass: number;
    image?: string;
    token?: string;
    biography?: string;
    notes?: string;
}

export interface NoteNode {
    id: string;
    name: string;
    type: 'folder' | 'file';
    content?: string;
    isOpen?: boolean;
    isLocked?: boolean;
    children?: NoteNode[];
}

// --- Monster Schema ---

export type CreatureType =
    | 'Aberração' | 'Besta' | 'Celestial' | 'Constructo' | 'Corruptor'
    | 'Dragão' | 'Elemental' | 'Fada' | 'Gigante' | 'Humanoide'
    | 'Limo' | 'Monstruosidade' | 'Planta' | 'Morto-Vivo' | 'Outro';

export type CreatureSize = 'Miúdo' | 'Pequeno' | 'Médio' | 'Grande' | 'Enorme' | 'Imenso';

export type Alignment = 'LB' | 'NB' | 'CB' | 'LN' | 'N' | 'CN' | 'LM' | 'NM' | 'CM';

export interface MonsterAction {
    name: string;
    description: string;
}

export interface Monster {
    id: string;
    name: string;
    type: CreatureType;
    size: CreatureSize;
    alignment: Alignment;
    ac: number;
    hp: number;
    speed: {
        walk?: number;
        burrow?: number;
        climb?: number;
        fly?: number;
        swim?: number;
    };
    cr: number;
    passivePerception: number;
    attributes: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    customModifiers?: {
        str?: number;
        dex?: number;
        con?: number;
        int?: number;
        wis?: number;
        cha?: number;
    };
    skills: Record<string, number>;
    senses: string | null;
    resistances: string[];
    immunities: string[];
    loot: string | null;
    languages: string | null;
    traits: MonsterAction[];
    actions: MonsterAction[];
    reactions: MonsterAction[];
    legendaryActions: MonsterAction[];
    regionalEffects: MonsterAction[];
    imgUrl?: string;
}

export interface Campaign {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    data: NoteNode[];
    characters: Character[];
    monsterNotes?: Record<string, string>; // monsterId -> HTML note content
    customMonsters?: Monster[]; // User-created custom monsters
}

export interface User {
    username: string;
    avatarUrl?: string;
}
