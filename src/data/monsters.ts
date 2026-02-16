import type { Monster } from '../types';

export const MONSTERS: Monster[] = [
    {
        "id": "aarakocra_aeromancer",
        "name": "Aarakocra Aeromancer",
        "type": "Medium Elemental (Aarakocra)",
        "alignment": "Neutral",
        "ac": "16",
        "hp": "66",
        "speed": "20 ft., fly 50 ft.",
        "str": 10,
        "dex": 16,
        "con": 12,
        "int": 12,
        "wis": 16,
        "cha": 12,
        "skills": "",
        "senses": "passive Perception 17",
        "languages": "Aarakocra, Primordial (Auran)",
        "challenge": "4",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "18 Bludgeoning, Lightning damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "18 Bludgeoning, Lightning damage."
            }
        ]
    },
    {
        "id": "aarakocra_skirmisher",
        "name": "Aarakocra Skirmisher",
        "type": "Medium Elemental (Aarakocra)",
        "alignment": "Neutral",
        "ac": "12",
        "hp": "11",
        "speed": "20 ft., fly 50 ft.",
        "str": 10,
        "dex": 14,
        "con": 12,
        "int": 10,
        "wis": 12,
        "cha": 10,
        "skills": "",
        "senses": "passive Perception 15",
        "languages": "Aarakocra, Primordial (Auran)",
        "challenge": "1/4",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "4 Slashing damage."
            },
            {
                "name": "Attack 2 (Melee)",
                "description": "7 Piercing, Thunder damage."
            },
            {
                "name": "Attack 3 (Ranged)",
                "description": "7 Piercing, Thunder damage."
            }
        ]
    },
    {
        "id": "aberrant_cultist",
        "name": "Aberrant Cultist",
        "type": "Medium or Small Humanoide (Cultist)",
        "alignment": "Neutral Evil",
        "ac": "14",
        "hp": "137",
        "speed": "30 ft.",
        "str": 10,
        "dex": 18,
        "con": 12,
        "int": 16,
        "wis": 18,
        "cha": 14,
        "skills": "",
        "senses": "passive Perception 17, Darkvision 90 ft.",
        "languages": "Common, Deep Speech, Telepathy",
        "challenge": "8",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Psychic damage."
            }
        ]
    },
    {
        "id": "aboleth",
        "name": "Aboleth",
        "type": "Large Aberração",
        "alignment": "Lawful Evil",
        "ac": "17",
        "hp": "150",
        "speed": "10 ft., swim 40 ft.",
        "str": 20,
        "dex": 8,
        "con": 14,
        "int": 18,
        "wis": 14,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 20",
        "languages": "Deep Speech, Telepathy",
        "challenge": "10",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious, Eldritch Restoration, Mucus Cloud, Probing Telepathy"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "12 Bludgeoning damage."
            }
        ]
    },
    {
        "id": "abominable_yeti",
        "name": "Abominable Yeti",
        "type": "Huge Monstruosidade",
        "alignment": "Chaotic Evil",
        "ac": "15",
        "hp": "137",
        "speed": "40 ft., climb 40 ft.",
        "str": 24,
        "dex": 10,
        "con": 22,
        "int": 8,
        "wis": 12,
        "cha": 8,
        "skills": "",
        "senses": "passive Perception 19, Darkvision 60 ft.",
        "languages": "Yeti",
        "challenge": "9",
        "traits": [
            {
                "name": "Traits",
                "description": "Fear of Fire"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Cold damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "19 Bludgeoning, Cold damage."
            }
        ]
    },
    {
        "id": "adult_black_dragon",
        "name": "Adult Black Dragon",
        "type": "Huge Dragão (Chromatic)",
        "alignment": "Chaotic Evil",
        "ac": "19",
        "hp": "195",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 22,
        "dex": 14,
        "con": 20,
        "int": 14,
        "wis": 12,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 21, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "14",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "17 Slashing, Acid damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "32 Acid damage."
            }
        ]
    },
    {
        "id": "adult_blue_dragon",
        "name": "Adult Blue Dragon",
        "type": "Huge Dragão (Chromatic)",
        "alignment": "Lawful Evil",
        "ac": "19",
        "hp": "212",
        "speed": "40 ft., fly 80 ft., burrow 30 ft.",
        "str": 24,
        "dex": 10,
        "con": 22,
        "int": 16,
        "wis": 14,
        "cha": 20,
        "skills": "",
        "senses": "passive Perception 22, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "16",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Lighting damage."
            },
            {
                "name": "Attack 2 (Range AOE)",
                "description": "14 Thunder damage."
            }
        ]
    },
    {
        "id": "adult_brass_dragon",
        "name": "Adult Brass Dragon",
        "type": "Huge Dragão (Metallic)",
        "alignment": "Chaotic Good",
        "ac": "18",
        "hp": "172",
        "speed": "40 ft., fly 80 ft., burrow 30 ft.",
        "str": 22,
        "dex": 10,
        "con": 20,
        "int": 14,
        "wis": 12,
        "cha": 16,
        "skills": "",
        "senses": "passive Perception 21, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "13",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Fire damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "21 Fire damage."
            }
        ]
    },
    {
        "id": "adult_bronze_dragon",
        "name": "Adult Bronze Dragon",
        "type": "Huge Dragão (Metallic)",
        "alignment": "Lawful Good",
        "ac": "18",
        "hp": "212",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 24,
        "dex": 10,
        "con": 22,
        "int": 16,
        "wis": 14,
        "cha": 20,
        "skills": "",
        "senses": "passive Perception 22, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "15",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Lighting damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "18 Radiant damage."
            }
        ]
    },
    {
        "id": "adult_copper_dragon",
        "name": "Adult Copper Dragon",
        "type": "Huge Dragão (Metallic)",
        "alignment": "Chaotic Good",
        "ac": "18",
        "hp": "184",
        "speed": "40 ft., fly 80 ft., climb 40 ft.",
        "str": 22,
        "dex": 12,
        "con": 20,
        "int": 18,
        "wis": 14,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 22, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "14",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Acid damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "23 Psychic damage."
            }
        ]
    },
    {
        "id": "adult_deep_dragon",
        "name": "Adult Deep Dragon",
        "type": "Huge Dragão",
        "alignment": "Neutral Evil",
        "ac": "17",
        "hp": "161",
        "speed": "40 ft., fly 80 ft., swim 40 ft., burrow 30 ft.",
        "str": 20,
        "dex": 14,
        "con": 16,
        "int": 16,
        "wis": 16,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 21, Darkvision 150 ft.",
        "languages": "Common, Draconic, Undercommon",
        "challenge": "11",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "19 Slashing, Poison damage."
            }
        ]
    },
    {
        "id": "adult_gold_dragon",
        "name": "Adult Gold Dragon",
        "type": "Huge Dragão (Metallic)",
        "alignment": "Lawful Good",
        "ac": "19",
        "hp": "243",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 26,
        "dex": 14,
        "con": 24,
        "int": 16,
        "wis": 14,
        "cha": 24,
        "skills": "",
        "senses": "passive Perception 24, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "17",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Fire damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "18 Radiant damage."
            }
        ]
    },
    {
        "id": "adult_green_dragon",
        "name": "Adult Green Dragon",
        "type": "Huge Dragão (Chromatic)",
        "alignment": "Lawful Evil",
        "ac": "19",
        "hp": "207",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 22,
        "dex": 12,
        "con": 20,
        "int": 18,
        "wis": 14,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 22, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "15",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "22 Slashing, Poison damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "14 Psychic damage."
            }
        ]
    },
    {
        "id": "adult_red_dragon",
        "name": "Adult Red Dragon",
        "type": "Huge Dragão (Chromatic)",
        "alignment": "Chaotic Evil",
        "ac": "19",
        "hp": "256",
        "speed": "40 ft., fly 80 ft., climb 40 ft.",
        "str": 26,
        "dex": 10,
        "con": 24,
        "int": 16,
        "wis": 12,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 23, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "17",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "18 Slashing, Fire damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "21 Fire damage."
            }
        ]
    },
    {
        "id": "adult_silver_dragon",
        "name": "Adult Silver Dragon",
        "type": "Huge Dragão (Metallic)",
        "alignment": "Lawful Good",
        "ac": "19",
        "hp": "216",
        "speed": "40 ft., fly 80 ft.",
        "str": 26,
        "dex": 10,
        "con": 24,
        "int": 16,
        "wis": 12,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 21, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "16",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "21 Slashing, Cold damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "12 Piercing, Cold damage."
            }
        ]
    },
    {
        "id": "adult_spirit_dragon",
        "name": "Adult Spirit Dragon",
        "type": "Huge Dragão",
        "alignment": "Neutral",
        "ac": "18",
        "hp": "207",
        "speed": "40 ft., fly 80 ft., burrow 30 ft.",
        "str": 22,
        "dex": 14,
        "con": 20,
        "int": 20,
        "wis": 14,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 17, Darkvision 120 ft.",
        "languages": "Common, Draconic, telepathy",
        "challenge": "15",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "22 Slashing, Necrotic damage."
            }
        ]
    },
    {
        "id": "adult_white_dragon",
        "name": "Adult White Dragon",
        "type": "Huge Dragão (Chromatic)",
        "alignment": "Chaotic Evil",
        "ac": "18",
        "hp": "200",
        "speed": "40 ft., fly 80 ft., swim 40 ft., burrow 30 ft.",
        "str": 22,
        "dex": 10,
        "con": 22,
        "int": 8,
        "wis": 12,
        "cha": 12,
        "skills": "",
        "senses": "passive Perception 21, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "13",
        "traits": [
            {
                "name": "Traits",
                "description": "Ice Walk"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "17 Slashing, Cold damage."
            }
        ]
    },
    {
        "id": "air_elemental",
        "name": "Air Elemental",
        "type": "Large Elemental",
        "alignment": "Neutral",
        "ac": "15",
        "hp": "90",
        "speed": "10 ft., fly 90 ft.",
        "str": 14,
        "dex": 20,
        "con": 14,
        "int": 6,
        "wis": 10,
        "cha": 6,
        "skills": "",
        "senses": "passive Perception 10, Darkvision 60 ft.",
        "languages": "Primordial (Auran)",
        "challenge": "5",
        "traits": [
            {
                "name": "Traits",
                "description": "Air Form"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "14 Thunder damage."
            }
        ]
    },
    {
        "id": "allosaurus",
        "name": "Allosaurus",
        "type": "Large Besta (Dinosaur)",
        "alignment": "Unaligned",
        "ac": "13",
        "hp": "51",
        "speed": "60 ft.",
        "str": 18,
        "dex": 12,
        "con": 16,
        "int": 2,
        "wis": 12,
        "cha": 4,
        "skills": "",
        "senses": "passive Perception 15",
        "languages": "None",
        "challenge": "2",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "15 Piercing damage."
            }
        ]
    },
    {
        "id": "ancient_black_dragon",
        "name": "Ancient Black Dragon",
        "type": "Gargantuan Dragão (Chromatic)",
        "alignment": "Chaotic Evil",
        "ac": "22",
        "hp": "367",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 26,
        "dex": 14,
        "con": 24,
        "int": 16,
        "wis": 14,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 26, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "21",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "26 Slashing, Acid damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "41 Acid damage."
            }
        ]
    },
    {
        "id": "ancient_blue_dragon",
        "name": "Ancient Blue Dragon",
        "type": "Gargantuan Dragão (Chromatic)",
        "alignment": "Lawful Evil",
        "ac": "22",
        "hp": "481",
        "speed": "40 ft., fly 80 ft., burrow 40 ft.",
        "str": 28,
        "dex": 10,
        "con": 26,
        "int": 18,
        "wis": 16,
        "cha": 24,
        "skills": "",
        "senses": "passive Perception 27, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "23",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "29 Slashing, Lighting damage."
            },
            {
                "name": "Attack 2 (Range AOE)",
                "description": "18 Thunder damage."
            }
        ]
    },
    {
        "id": "ancient_brass_dragon",
        "name": "Ancient Brass Dragon",
        "type": "Gargantuan Dragão (Metallic)",
        "alignment": "Chaotic Good",
        "ac": "20",
        "hp": "332",
        "speed": "40 ft., fly 80 ft., burrow 40 ft.",
        "str": 26,
        "dex": 10,
        "con": 24,
        "int": 16,
        "wis": 14,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 24, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "20",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "26 Slashing, Fire damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "28 Fire damage."
            }
        ]
    },
    {
        "id": "ancient_bronze_dragon",
        "name": "Ancient Bronze Dragon",
        "type": "Gargantuan Dragão (Metallic)",
        "alignment": "Lawful Good",
        "ac": "22",
        "hp": "444",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 28,
        "dex": 10,
        "con": 26,
        "int": 18,
        "wis": 16,
        "cha": 24,
        "skills": "",
        "senses": "passive Perception 27, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "22",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "27 Slashing, Lighting damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "18 Radiant damage."
            }
        ]
    },
    {
        "id": "ancient_copper_dragon",
        "name": "Ancient Copper Dragon",
        "type": "Gargantuan Dragão (Metallic)",
        "alignment": "Chaotic Good",
        "ac": "21",
        "hp": "367",
        "speed": "40 ft., fly 80 ft., climb 40 ft.",
        "str": 26,
        "dex": 12,
        "con": 24,
        "int": 20,
        "wis": 16,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 27, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "21",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "28 Slashing, Acid damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "27 Psychic damage."
            }
        ]
    },
    {
        "id": "ancient_deep_dragon",
        "name": "Ancient Deep Dragon",
        "type": "Gargantuan Dragão",
        "alignment": "Neutral Evil",
        "ac": "20",
        "hp": "247",
        "speed": "40 ft., fly 80 ft., swim 40 ft., burrow 40 ft.",
        "str": 22,
        "dex": 16,
        "con": 22,
        "int": 18,
        "wis": 18,
        "cha": 20,
        "skills": "",
        "senses": "passive Perception 26, Darkvision 300 ft.",
        "languages": "Common, Draconic, Undercommon",
        "challenge": "18",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "22 Slashing, Poison damage."
            }
        ]
    },
    {
        "id": "ancient_gold_dragon",
        "name": "Ancient Gold Dragon",
        "type": "Gargantuan Dragão (Metallic)",
        "alignment": "Lawful Good",
        "ac": "22",
        "hp": "546",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 30,
        "dex": 14,
        "con": 28,
        "int": 18,
        "wis": 16,
        "cha": 28,
        "skills": "",
        "senses": "passive Perception 27, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "24",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "28 Slashing, Fire damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "25 Radiant damage."
            }
        ]
    },
    {
        "id": "ancient_green_dragon",
        "name": "Ancient Green Dragon",
        "type": "Gargantuan Dragão (Chromatic)",
        "alignment": "Lawful Evil",
        "ac": "21",
        "hp": "402",
        "speed": "40 ft., fly 80 ft., swim 40 ft.",
        "str": 26,
        "dex": 12,
        "con": 24,
        "int": 20,
        "wis": 16,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 27, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "22",
        "traits": [
            {
                "name": "Traits",
                "description": "Amphibious"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "27 Slashing, Poison damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "21 Psychic damage."
            }
        ]
    },
    {
        "id": "ancient_red_dragon",
        "name": "Ancient Red Dragon",
        "type": "Gargantuan Dragão (Chromatic)",
        "alignment": "Chaotic Evil",
        "ac": "22",
        "hp": "507",
        "speed": "40 ft., fly 80 ft., climb 40 ft.",
        "str": 30,
        "dex": 10,
        "con": 28,
        "int": 18,
        "wis": 14,
        "cha": 26,
        "skills": "",
        "senses": "passive Perception 26, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "24",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "29 Slashing, Fire damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "28 Fire damage."
            }
        ]
    },
    {
        "id": "ancient_silver_dragon",
        "name": "Ancient Silver Dragon",
        "type": "Gargantuan Dragão (Metallic)",
        "alignment": "Lawful Good",
        "ac": "22",
        "hp": "468",
        "speed": "40 ft., fly 80 ft.",
        "str": 30,
        "dex": 10,
        "con": 28,
        "int": 18,
        "wis": 14,
        "cha": 26,
        "skills": "",
        "senses": "passive Perception 26, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "23",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "28 Slashing, Cold damage."
            },
            {
                "name": "Attack 2 (Ranged)",
                "description": "16 Piercing, Cold damage."
            }
        ]
    },
    {
        "id": "ancient_spirit_dragon",
        "name": "Ancient Spirit Dragon",
        "type": "Gargantuan Dragão",
        "alignment": "Neutral",
        "ac": "21",
        "hp": "420",
        "speed": "40 ft., fly 80 ft., burrow 30 ft.",
        "str": 26,
        "dex": 14,
        "con": 24,
        "int": 24,
        "wis": 18,
        "cha": 22,
        "skills": "",
        "senses": "passive Perception 21, Darkvision 120 ft.",
        "languages": "Common, Draconic, telepathy",
        "challenge": "22",
        "traits": [],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "28 Slashing, Necrotic damage."
            }
        ]
    },
    {
        "id": "ancient_white_dragon",
        "name": "Ancient White Dragon",
        "type": "Gargantuan Dragão (Chromatic)",
        "alignment": "Chaotic Evil",
        "ac": "20",
        "hp": "333",
        "speed": "40 ft., fly 80 ft., swim 40 ft., burrow 40 ft.",
        "str": 26,
        "dex": 10,
        "con": 26,
        "int": 10,
        "wis": 12,
        "cha": 18,
        "skills": "",
        "senses": "passive Perception 23, Darkvision 120 ft.",
        "languages": "Common, Draconic",
        "challenge": "20",
        "traits": [
            {
                "name": "Traits",
                "description": "Ice Walk"
            }
        ],
        "actions": [
            {
                "name": "Attack 1 (Melee)",
                "description": "24 Slashing, Cold damage."
            }
        ]
    }
];
