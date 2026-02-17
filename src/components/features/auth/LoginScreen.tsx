import { useState } from 'react';

interface LoginScreenProps {
    onLogin: (username: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
                <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center text-3xl mx-auto mb-6 font-bold text-zinc-950">
                    🐲
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Goblins & Dragons</h1>
                <p className="text-gray-400 mb-8">Gerenciador de Campanhas RPG</p>

                <form onSubmit={handleSubmit}>
                    <input
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nome do Mestre"
                        className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg mb-4 focus:border-orange-500 outline-none text-center"
                        required
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-orange-900/20"
                    >
                        Acessar
                    </button>
                </form>
            </div>
        </div>
    );
}
