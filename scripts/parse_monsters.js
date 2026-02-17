import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../src/data/raw_monsters.csv');
const outputPath = path.join(__dirname, '../src/data/monsters.json');

// --- Mappings ---

const typeMap = {
    'Aberration': 'Aberração',
    'Beast': 'Besta',
    'Celestial': 'Celestial',
    'Construct': 'Constructo',
    'Dragon': 'Dragão',
    'Elemental': 'Elemental',
    'Fey': 'Fada',
    'Fiend': 'Corruptor',
    'Giant': 'Gigante',
    'Humanoid': 'Humanoide',
    'Monstrosity': 'Monstruosidade',
    'Ooze': 'Limo',
    'Plant': 'Planta',
    'Undead': 'Morto-Vivo'
};

const sizeMap = {
    'Tiny': 'Miúdo',
    'Small': 'Pequeno',
    'Medium': 'Médio',
    'Medium or Small': 'Médio',
    'Large': 'Grande',
    'Huge': 'Enorme',
    'Gargantuan': 'Imenso'
};

const alignmentMap = {
    'Lawful Good': 'LB',
    'Neutral Good': 'NB',
    'Chaotic Good': 'CB',
    'Lawful Neutral': 'LN',
    'Neutral': 'N',
    'Chaotic Neutral': 'CN',
    'Lawful Evil': 'LM',
    'Neutral Evil': 'NM',
    'Chaotic Evil': 'CM',
    'Unaligned': 'N'
};

const skillMap = {
    'Acrobatics': 'Acrobacia',
    'Animal Handling': 'Adestrar Animais',
    'Arcana': 'Arcanismo',
    'Arcanna': 'Arcanismo',
    'Athletics': 'Atletismo',
    'Deception': 'Enganação',
    'History': 'História',
    'Insight': 'Intuição',
    'Intimidation': 'Intimidação',
    'Investigation': 'Investigação',
    'Medicine': 'Medicina',
    'Nature': 'Natureza',
    'Perception': 'Percepção',
    'Performance': 'Performance',
    'Persuasion': 'Persuasão',
    'Religion': 'Religião',
    'Sleight of Hand': 'Prestidigitação',
    'Stealth': 'Furtividade',
    'Survival': 'Sobrevivência'
};

// CR string to number
const parseCR = (crStr) => {
    if (!crStr) return 0;
    crStr = crStr.trim();
    if (crStr === '1/8') return 0.125;
    if (crStr === '1/4') return 0.25;
    if (crStr === '1/2') return 0.5;
    const num = parseFloat(crStr);
    return isNaN(num) ? 0 : num;
};

// --- CSV Parser ---

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

// --- Main ---

try {
    let data = fs.readFileSync(csvPath, 'utf8');
    if (data.charCodeAt(0) === 0xFEFF) data = data.slice(1);

    const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
        console.error('CSV data appears empty or malformed');
        process.exit(1);
    }

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
        strMod: getIndex('STR Mod'),
        dexMod: getIndex('DEX Mod'),
        conMod: getIndex('CON Mod'),
        intMod: getIndex('INT Mod'),
        wisMod: getIndex('WIS Mod'),
        chaMod: getIndex('CHA Mod'),
        proficient: getIndex('Proficient'),
        expertise: getIndex('Expertise'),
        passPerc: getIndex('Passive Perception'),
        languages: getIndex('Languages'),
        cr: getIndex('CR'),
        traits: getIndex('Traits'),
        vulnerabilities: getIndex('Vulnerabilities'),
        resistances: getIndex('Resistances'),
        immConditions: getIndex('Immunities Conditions'),
        immDamage: getIndex('Immunities Damage'),
        blindsight: getIndex('Blindsight'),
        darkvision: getIndex('Darkvision'),
        truesight: getIndex('Truesight'),
        tremorsense: getIndex('Tremorsense'),
        treasure: getIndex('Treasure'),
        actionNotes: getIndex('Action Notes'),
        legendaryActions: getIndex('Legendary Actions.'),
        lair: getIndex('Lair'),
        bonusAction: getIndex('Bonus Action'),
        reaction: getIndex('Reaction'),
        pb: getIndex('PB'),
        other: getIndex('Other'),
    };

    if (idx.name === -1) {
        console.error('CRITICAL ERROR: "Name" column not found.');
        process.exit(1);
    }

    // Helper: convert modifier to ability score
    const modToScore = (modStr) => {
        const mod = parseInt(modStr);
        if (isNaN(mod)) return 10;
        return 10 + (mod * 2);
    };

    // Helper: parse skills from Proficient/Expertise columns + PB
    const parseSkills = (profStr, expertStr, pbStr) => {
        const skills = {};
        const pb = parseInt(pbStr) || 2;
        const profSkills = profStr ? profStr.split(',').map(s => s.trim()).filter(Boolean) : [];
        const expertSkills = expertStr ? expertStr.split(',').map(s => s.trim()).filter(Boolean) : [];

        for (const skill of profSkills) {
            const ptName = skillMap[skill] || skill;
            skills[ptName] = pb;
        }
        for (const skill of expertSkills) {
            const ptName = skillMap[skill] || skill;
            skills[ptName] = pb * 2;
        }
        return skills;
    };

    // Helper: parse resistances/immunities as string[]
    const parseStringArray = (...fields) => {
        const result = [];
        for (const field of fields) {
            if (field && field.trim()) {
                field.split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
                    if (!result.includes(s)) result.push(s);
                });
            }
        }
        return result;
    };

    // Helper: build senses string
    const buildSenses = (row) => {
        const parts = [];
        const bs = row[idx.blindsight];
        const dv = row[idx.darkvision];
        const ts = row[idx.truesight];
        const tr = row[idx.tremorsense];
        if (bs) parts.push(`Visão às cegas ${bs} ft.`);
        if (dv) parts.push(`Visão no escuro ${dv} ft.`);
        if (ts) parts.push(`Visão verdadeira ${ts} ft.`);
        if (tr) parts.push(`Sentido sísmico ${tr} ft.`);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    const monsters = [];

    for (let i = 1; i < lines.length; i++) {
        const row = splitCSV(lines[i]);
        if (row.length < 5) continue;

        const name = row[idx.name];
        if (!name) continue;

        // Type
        const typeRaw = row[idx.type] || '';
        const mainType = typeRaw.split(/[\(,]/)[0].trim();
        const type = typeMap[mainType] || 'Outro';

        // Size
        const sizeRaw = row[idx.size] || 'Medium';
        const size = sizeMap[sizeRaw] || 'Médio';

        // Alignment
        const alignRaw = row[idx.align] || 'Neutral';
        const alignment = alignmentMap[alignRaw] || 'N';

        // Speed object
        const speed = {};
        const walkVal = parseInt(row[idx.walk]);
        const flyVal = parseInt(row[idx.fly]);
        const swimVal = parseInt(row[idx.swim]);
        const climbVal = parseInt(row[idx.climb]);
        const burrowVal = parseInt(row[idx.burrow]);
        if (!isNaN(walkVal)) speed.walk = walkVal;
        if (!isNaN(flyVal)) speed.fly = flyVal;
        if (!isNaN(swimVal)) speed.swim = swimVal;
        if (!isNaN(climbVal)) speed.climb = climbVal;
        if (!isNaN(burrowVal)) speed.burrow = burrowVal;
        if (Object.keys(speed).length === 0) speed.walk = 30;

        // Attributes
        const attributes = {
            str: modToScore(row[idx.strMod]),
            dex: modToScore(row[idx.dexMod]),
            con: modToScore(row[idx.conMod]),
            int: modToScore(row[idx.intMod]),
            wis: modToScore(row[idx.wisMod]),
            cha: modToScore(row[idx.chaMod])
        };

        // Skills
        const skills = parseSkills(
            row[idx.proficient] || '',
            row[idx.expertise] || '',
            row[idx.pb] || '2'
        );

        // Senses
        const senses = buildSenses(row);

        // Resistances & Immunities
        const resistances = parseStringArray(row[idx.resistances] || '');
        const immunities = parseStringArray(
            row[idx.immDamage] || '',
            row[idx.immConditions] || ''
        );

        // Traits
        const traits = [];
        const traitsRaw = row[idx.traits];
        if (traitsRaw && traitsRaw.trim()) {
            traitsRaw.split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
                traits.push({ name: t, description: '' });
            });
        }

        // Actions
        const actions = [];
        for (let n = 1; n <= 4; n++) {
            const typeIdx = getIndex(`Atk ${n} Type`);
            const damageIdx = getIndex(`Atk ${n} Dam.`);
            const dtypeIdx = getIndex(`Atk ${n} Damage Type`);
            if (typeIdx === -1) continue;

            const atkType = row[typeIdx];
            if (!atkType) continue;

            const damage = row[damageIdx] || '';
            const dtype = row[dtypeIdx] || '';
            if (!damage && !dtype) continue;

            actions.push({
                name: `Ataque ${n} (${atkType})`,
                description: `${damage} ${dtype} dano.`.trim()
            });
        }

        // Action Notes (extra abilities)
        const actionNotes = row[idx.actionNotes];
        if (actionNotes && actionNotes.trim()) {
            actions.push({
                name: 'Habilidades Especiais',
                description: actionNotes.trim()
            });
        }

        // Reactions
        const reactions = [];
        const reactionRaw = row[idx.reaction];
        if (reactionRaw && reactionRaw.trim()) {
            reactions.push({ name: 'Reação', description: reactionRaw.trim() });
        }

        // Legendary Actions
        const legendaryActions = [];
        const legendaryRaw = row[idx.legendaryActions];
        if (legendaryRaw && legendaryRaw.trim()) {
            legendaryRaw.split(',').map(a => a.trim()).filter(Boolean).forEach(a => {
                legendaryActions.push({ name: 'Ação Lendária', description: a });
            });
        }

        // Regional Effects
        const regionalEffects = [];
        const otherRaw = row[idx.other];
        if (otherRaw && otherRaw.trim()) {
            regionalEffects.push({ name: 'Efeito Regional', description: otherRaw.trim() });
        }

        // Loot
        const loot = row[idx.treasure] && row[idx.treasure].trim() ? row[idx.treasure].trim() : null;

        // Passive Perception
        const pp = parseInt(row[idx.passPerc]) || 10;

        // CR
        const cr = parseCR(row[idx.cr]);

        const monster = {
            id: crypto.randomUUID(),
            name,
            type,
            size,
            alignment,
            ac: parseInt(row[idx.ac]) || 10,
            hp: parseInt(row[idx.hp]) || 10,
            speed,
            cr,
            passivePerception: pp,
            attributes,
            skills,
            senses,
            resistances,
            immunities,
            loot,
            languages: row[idx.languages] || null,
            traits,
            actions,
            reactions,
            legendaryActions,
            regionalEffects
        };

        monsters.push(monster);
    }

    fs.writeFileSync(outputPath, JSON.stringify(monsters, null, 2), 'utf8');
    console.log(`✅ Successfully generated ${monsters.length} monsters → monsters.json`);

} catch (err) {
    console.error('Error parsing CSV:', err);
    process.exit(1);
}
