import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../src/data/raw_monsters.csv');
const outputPath = path.join(__dirname, '../src/data/monsters.ts');

try {
    let data = fs.readFileSync(csvPath, 'utf8');
    // Remove BOM if present
    if (data.charCodeAt(0) === 0xFEFF) {
        data = data.slice(1);
    }

    const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length < 2) {
        console.error('CSV data appears empty or malformed');
        process.exit(1);
    }

    const splitCSV = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    // Headers are on the FIRST line (index 0)
    const headers = splitCSV(lines[0]);
    console.log('Headers detected:', headers.slice(0, 5));

    const getIndex = (name) => headers.indexOf(name);

    const idx = {
        name: getIndex('Name'),
        size: getIndex('Size'),
        type: getIndex('Type'),
        align: getIndex('Alignment'),
        ac: getIndex('AC'),
        hp: getIndex('HP'),
        walk: getIndex('Walk'),
        fly: getIndex('Fly'),
        swim: getIndex('Swim'),
        climb: getIndex('Climb'),
        burrow: getIndex('Burrow'),
        str: getIndex('STR Mod'),
        dex: getIndex('DEX Mod'),
        con: getIndex('CON Mod'),
        int: getIndex('INT Mod'),
        wis: getIndex('WIS Mod'),
        cha: getIndex('CHA Mod'),
        skills: getIndex('Skills'),
        senses: getIndex('Senses'),
        passPerc: getIndex('Passive Perception'),
        languages: getIndex('Languages'),
        cr: getIndex('CR'),
        traits: getIndex('Traits'),
    };

    if (idx.name === -1) {
        console.error('CRITICAL ERROR: "Name" column not found in headers.');
        console.log('Available headers:', headers);
        process.exit(1);
    }

    const monsters = [];

    // Start from line 1 (skip headers at 0)
    for (let i = 1; i < lines.length; i++) {
        const row = splitCSV(lines[i]);
        if (row.length < 5) continue;

        const name = row[idx.name];
        if (!name) continue;

        const size = row[idx.size] || '';
        const typeRaw = row[idx.type] || '';

        // Mapeamento de tipos em inglês para português
        const typeMap = {
            'Aberration': 'Aberração',
            'Beast': 'Besta',
            'Celestial': 'Celestial',
            'Construct': 'Constructo',
            'Dragon': 'Dragão',
            'Elemental': 'Elemental',
            'Fey': 'Feérico',
            'Fiend': 'Corruptor',
            'Giant': 'Gigante',
            'Humanoid': 'Humanoide',
            'Monstrosity': 'Monstruosidade',
            'Ooze': 'Limo',
            'Plant': 'Planta',
            'Undead': 'Morto-Vivo'
        };

        // Extrair apenas o tipo principal (primeira palavra antes de parênteses ou vírgula)
        const mainType = typeRaw.split(/[\(,]/)[0].trim();
        const translatedType = typeMap[mainType] || mainType;

        // Se houver informação adicional (como raça), manter em português quando possível
        const additionalInfo = typeRaw.includes('(') ? ' ' + typeRaw.substring(typeRaw.indexOf('(')) : '';

        const type = `${size} ${translatedType}${additionalInfo}`.trim();

        const getScore = (modStr) => {
            const mod = parseInt(modStr);
            if (isNaN(mod)) return 10;
            return 10 + (mod * 2);
        };

        const speeds = [];
        if (row[idx.walk]) speeds.push(`${row[idx.walk]} ft.`);
        if (row[idx.fly]) speeds.push(`fly ${row[idx.fly]} ft.`);
        if (row[idx.swim]) speeds.push(`swim ${row[idx.swim]} ft.`);
        if (row[idx.climb]) speeds.push(`climb ${row[idx.climb]} ft.`);
        if (row[idx.burrow]) speeds.push(`burrow ${row[idx.burrow]} ft.`);
        const speed = speeds.join(', ') || '30 ft.';

        const sensesList = [];
        const pp = row[idx.passPerc];
        if (pp) sensesList.push(`passive Perception ${pp}`);
        const dv = row[getIndex('Darkvision')];
        if (dv) sensesList.push(`Darkvision ${dv} ft.`);
        const senses = sensesList.join(', ');

        const traits = [];
        if (row[idx.traits]) {
            traits.push({ name: 'Traits', description: row[idx.traits] });
        }

        const actions = [];
        const getAttack = (n) => {
            const typeIdx = getIndex(`Atk ${n} Type`);
            const damageIdx = getIndex(`Atk ${n} Dam.`);
            const dtypeIdx = getIndex(`Atk ${n} Damage Type`);

            if (typeIdx === -1) return null;

            const type = row[typeIdx];
            if (!type) return null;

            const damage = row[damageIdx] || '';
            const dtype = row[dtypeIdx] || '';

            if (!damage && !dtype) return null;

            return {
                name: `Attack ${n} (${type})`,
                description: `${damage} ${dtype} damage.`
            };
        }

        const atk1 = getAttack(1); if (atk1) actions.push(atk1);
        const atk2 = getAttack(2); if (atk2) actions.push(atk2);
        const atk3 = getAttack(3); if (atk3) actions.push(atk3);
        const atk4 = getAttack(4); if (atk4) actions.push(atk4);

        const id = name.toLowerCase().replace(/[^a-z0-9]/g, '_');

        const monster = {
            id,
            name,
            type,
            alignment: row[idx.align] || 'Unaligned',
            ac: row[idx.ac] || 10,
            hp: row[idx.hp] || '10',
            speed,
            str: getScore(row[idx.str]),
            dex: getScore(row[idx.dex]),
            con: getScore(row[idx.con]),
            int: getScore(row[idx.int]),
            wis: getScore(row[idx.wis]),
            cha: getScore(row[idx.cha]),
            skills: row[idx.skills] || '',
            senses,
            languages: row[idx.languages] || '-',
            challenge: row[idx.cr] || '0',
            traits,
            actions
        };

        monsters.push(monster);
    }

    const tsContent = `import type { Monster } from '../types';

export const MONSTERS: Monster[] = ${JSON.stringify(monsters, null, 4)};
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log(`Successfully generated ${monsters.length} monsters.`);

} catch (err) {
    console.error('Error parsing CSV:', err);
    process.exit(1);
}
