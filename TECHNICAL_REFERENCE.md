# 🛠️ Documentação Técnica

Este documento destina-se a desenvolvedores que desejam compreender a arquitetura, estrutura de dados e decisões técnicas por trás do **Goblins & Dragons**.

## 🧬 Interfaces e Modelos de Dados

O projeto utiliza **TypeScript** para garantir a integridade dos dados. Abaixo estão as principais interfaces que compõem o "esqueleto" do sistema.

### 1. Monstro (`Monster`)

A interface `Monster` é o núcleo do Bestiário. Ela define todas as propriedades estatísticas e descritivas de uma criatura.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` (UUID) | Identificador único do monstro. Crucial para diferenciação. |
| `name` | `string` | Nome da criatura (ex: "Dragão Vermelho"). |
| `type` | `CreatureType` | Tipo da criatura (ex: "Dragão", "Morto-Vivo"). |
| `size` | `CreatureSize` | Tamanho (ex: "Médio", "Enorme"). |
| `alignment` | `Alignment` | Tendência (ex: "LM" para Leal e Mau). |
| `ac` | `number` | Classe de Armadura base. |
| `hp` | `number` | Pontos de Vida médios. |
| `speed` | `object` | Deslocamentos (caminhada, voo, natação, etc). |
| `attributes` | `object` | Valores brutos de atributos (for, des, con, int, sab, car). |
| `skills` | `Record<string, number>` | Perícias treinadas e seus bônus. |
| `senses` | `string \| null` | Sentidos especiais (ex: Visão no Escuro). |
| `resistances` | `string[]` | Lista de danos aos quais a criatura é resistente. |
| `immunities` | `string[]` | Lista de imunidades a dano ou condições. |
| `actions` | `MonsterAction[]` | Ações padrão (Ataques, Habilidades). |
| `legendary` | `MonsterAction[]` | Ações lendárias (se houver). |

### 2. Campanha (`Campaign`)

Gerencia o estado de uma mesa de jogo.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` (UUID) | Identificador único da campanha. |
| `title` | `string` | Título da campanha. |
| `data` | `NoteNode[]` | Estrutura de árvore (pastas/arquivos) para as notas da campanha. |
| `characters` | `Character[]` | Lista de NPCs e Personagens vinculados. |
| `monsterNotes`| `Record<string, string>` | Notas específicas atreladas a IDs de monstros. |

### 3. Notas (`NoteNode`)

O sistema de notas utiliza uma estrutura recursiva de árvore para simular um sistema de arquivos.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` (UUID) | Identificador do nó. |
| `type` | `'folder' \| 'file'` | Define se é uma pasta ou um documento. |
| `children` | `NoteNode[]` | (Apenas pastas) Lista de nós filhos. |
| `content` | `string` (HTML) | Conteúdo do editor Rich Text (apenas arquivos). |

---

## 🔑 Lógica de IDs (UUID)

A integridade do sistema depende fortemente do uso de **UUIDs (Universally Unique Identifiers)**.

*   **Evitar Conflitos:** Como o sistema permite a criação de monstros customizados e múltiplas campanhas que podem ser exportadas/importadas (futuramente), IDs numéricos sequenciais (1, 2, 3...) causariam colisões fatais.
*   **Persistência:** O `id` é a chave primária para vincular notas a monstros e personagens a campanhas.
*   **Geração:** Utilizamos a biblioteca nativa, `crypto.randomUUID()` ou similar, para garantir unicidade global.

---

## 🌐 Tradução e Camada de UI

Uma decisão arquitetural importante foi manter a estrutura de dados (`Schema`) em **Inglês**, alinhada com os padrões internacionais (SRD 5.1), enquanto a **Interface de Usuário (UI)** é totalmente em **Português**.

*   **Backend/Dados:** O JSON armazena chaves como `str`, `dex`, `skills`, `actions`.
*   **Frontend/UI:** O componente React consome esses dados e os renderiza traduzidos.
    *   `str` torna-se **FOR** (Força).
    *   `actions` é renderizado na seção **Ações**.
    *   Valores de atributos são convertidos dinamicamente em modificadores na tela (ex: 10 virá +0, 12 vira +1).

Isso facilita a manutenção do código e a importação de novos dados de fontes externas sem quebrar a aplicação.

---

## 📄 Exemplo de JSON

Abaixo, um exemplo da estrutura de um monstro armazenado em `monsters.json`:

```json
{
  "id": "fefbf2e4-4cb2-43f2-92f4-042e399ec5df",
  "name": "Aarakocra Aeromancer",
  "type": "Elemental",
  "size": "Médio",
  "alignment": "N",
  "ac": 16,
  "hp": 66,
  "speed": {
    "walk": 20,
    "fly": 50
  },
  "attributes": {
    "str": 10,
    "dex": 16,
    "con": 12,
    "int": 12,
    "wis": 16,
    "cha": 12
  },
  "skills": {
    "Arcanismo": 2,
    "Natureza": 2,
    "Percepção": 4
  },
  "actions": [
    {
      "name": "Ataque 1 (Melee)",
      "description": "18 Bludgeoning, Lightning dano."
    }
  ]
}
```
