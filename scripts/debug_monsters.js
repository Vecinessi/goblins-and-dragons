import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../src/data/raw_monsters.csv');
const outputPath = path.join(__dirname, '../src/data/monsters.ts');

try {
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split(/\r?\n/).filter(line => line.trim() !== '');

    console.log(`Total lines: ${lines.length}`);
    console.log(`Line 0: ${lines[0].substring(0, 50)}...`);
    console.log(`Line 1: ${lines[1].substring(0, 50)}...`);

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

    const headers = splitCSV(lines[1]);
    console.log('Headers found:', headers.slice(0, 5));

    const getIndex = (name) => headers.indexOf(name);

    // Updated indexing based on exact CSV headers from user
    const idx = {
        name: getIndex('Name'),
        size: getIndex('Size'),
        type: getIndex('Type'),
        align: getIndex('Alignment'),
        ac: getIndex('AC')
    };

    console.log('Indices:', idx);

    if (idx.name === -1) {
        console.error('CRITICAL: Name header not found!');
        console.log('All headers:', headers);
    }

    const monsters = [];

    // Start from line 2
    for (let i = 2; i < lines.length; i++) {
        const row = splitCSV(lines[i]);
        if (row.length < 5) {
            console.log(`Skipping row ${i}, length ${row.length}`);
            continue;
        }

        const name = row[idx.name];
        if (!name) {
            console.log(`Skipping row ${i}, no name. Index ${idx.name}, Value: ${row[idx.name]}`);
            continue;
        }

        console.log(`Found monster: ${name}`);
        monsters.push({
            id: name,
            name: name
        });
        if (monsters.length >= 3) break; // Just test first 3
    }

    console.log(`Mock conversion finished. Found ${monsters.length} monsters.`);

} catch (err) {
    console.error('Error parsing CSV:', err);
    process.exit(1);
}
