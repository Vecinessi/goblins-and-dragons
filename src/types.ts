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

export interface FileNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  content?: string;
  isOpen?: boolean;
  isLocked?: boolean;
  children?: FileNode[];
}

export interface Monster {
  id: string;
  name: string;
  type: string;
  alignment: string;
  ac: string | number; // Some sources might have strings
  hp: string;
  speed: string;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  skills?: string;
  senses?: string;
  languages?: string;
  challenge: string;
  traits?: { name: string; description: string }[];
  actions?: { name: string; description: string }[];
  legendaryActions?: { name: string; description: string }[];
  reactions?: { name: string; description: string }[];
  imgUrl?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  data: FileNode[];
  characters: Character[];
  monsterNotes?: Record<string, string>; // monsterId -> HTML note content
  customMonsters?: Monster[]; // User-created custom monsters
}

export interface User {
  username: string;
  avatarUrl?: string;
}