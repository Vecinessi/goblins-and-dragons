# 🐉 Goblins & Dragons

**Um sistema de campanhas para RPG baseado em D&D 2024.**

Goblins & Dragons é uma aplicação web moderna desenhada para Mestres de RPG que desejam gerenciar suas campanhas, monstros e notas de forma eficiente e visualmente imersiva. Com uma interface rica e intuitiva, o sistema simplifica a gestão de combate e narrativa.

## ✨ Funcionalidades

O sistema conta com um conjunto robusto de ferramentas para auxiliar na mestragem:

- **📜 Visualização de Fichas**: Fichas de monstros completas, traduzidas e formatadas para leitura rápida durante o jogo.
- **🧮 Cálculo Automático de Modificadores**: Insira os valores de atributos e o sistema calcula automaticamente os modificadores (ex: Força 18 -> +4).
- **📝 Módulo de Notas Robusto**: Um editor de texto rico (Rich Text) com suporte a organização por pastas e arquivos. Salve, edite e organize suas anotações de campanha livremente.
- **👾 Banco de Dados Pré-definido**: Centenas de monstros do D&D (SRD) já cadastrados e prontos para uso.
- **🛠️ Monstros Customizados**: Crie seus próprios monstros com suporte total a todos os campos da ficha (ações, reações, lendárias).
- **🌍 Múltiplas Campanhas**: Crie e gerencie várias campanhas simultaneamente, mantendo notas e NPCs separados por contexto.
- **🎲 Módulo de Rolagem**: Rolador de dados integrado para testes rápidos.
- **👤 Criação de NPCs**: Gerenciador de Personagens do Mestre (PDMs) para criar e armazenar fichas de aliados e vilões.

## 🚀 Tecnologias

Este projeto foi construído com foco em performance e experiência de usuário, utilizando as tecnologias mais modernas do ecossistema JavaScript:

- **[React](https://react.dev/)**: Biblioteca para construção de interfaces de usuário.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática para maior segurança e manutenibilidade do código.
- **[Vite](https://vitejs.dev/)**: Build tool de próxima geração para desenvolvimento rápido.
- **[TailwindCSS](https://tailwindcss.com/)**: Framework CSS utility-first para estilização ágil e responsiva.
- **Persistence**: Dados persistidos localmente via JSON e LocalStorage.

## 📦 Instalação e Uso

Siga os passos abaixo para rodar o projeto localmente:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/goblins-and-dragons.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   Abra seu navegador em `http://localhost:5173` (ou a porta indicada no terminal).

## 📂 Estrutura de Arquivos de Dados

Os dados vitais do sistema estão organizados da seguinte forma:

- **`src/data/monsters.json`**: Contém o bestiário "core" do sistema. É um arquivo estático com centenas de monstros pré-definidos.
- **`src/data/custom_monsters.json`**: Armazena os monstros criados pelo usuário.
- **`src/data/campaigns.json`** (Gerado dinamicamente/LocalStorage): Onde são salvos os estados das campanhas e notas.
