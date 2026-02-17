import { useState, useEffect, useRef } from 'react';
import type { WindowState, NoteNode } from '../../../types';
import { NoteEditor } from './NoteEditor';
import { NoteTree } from './NoteTree';
import { useWindowPosition } from '../../../hooks/useWindowPosition';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { findNote, updateNodesRecursively } from '../../../utils/treeUtils';

interface NotesPanelProps {
    windowState: WindowState;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    initialNodes: NoteNode[];
    onSave: (nodes: NoteNode[]) => void;
}

export function NotesPanel({
    windowState,
    onClose,
    onMinimize,
    onMaximize,
    initialNodes,
    onSave
}: NotesPanelProps) {
    if (windowState === 'CLOSED') return null;

    // --- STATE ---
    const [nodes, setNodes] = useState<NoteNode[]>(initialNodes);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    // Interface State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');

    const menuRef = useRef<HTMLDivElement>(null);

    // --- HOOKS ---
    const {
        windowRef,
        style: windowStyle,
        isMinimized
    } = useWindowPosition({
        windowState,
        initialPosition: { x: window.innerWidth - 850, y: 100 }, // Default ~right side
    });

    const {
        draggedNodeId,
        dropTargetId,
        dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragOverRoot,
        handleDrop,
    } = useDragAndDrop(nodes, setNodes, (msg) => showToast(msg));

    // --- EFFECTS ---
    useEffect(() => {
        onSave(nodes);
    }, [nodes, onSave]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                if (isDeleteModalOpen) { setIsDeleteModalOpen(false); return; }
                if (isMenuOpen) { setIsMenuOpen(false); return; }
                if (editingId) { setEditingId(null); return; }
                if (activeNoteId) { setActiveNoteId(null); }
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeNoteId, isDeleteModalOpen, isMenuOpen, editingId]);

    // --- HELPERS ---
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const activeNote = activeNoteId ? findNote(activeNoteId, nodes) : null;

    // --- ACTIONS ---
    const createNewNote = () => {
        const newNote: NoteNode = { id: Date.now().toString(), name: 'Nova Nota', type: 'file', content: '', isLocked: false };
        setNodes([...nodes, newNote]);
        setActiveNoteId(newNote.id);
        setIsMenuOpen(false);
    };

    const containsLockedItems = (list: NoteNode[]): boolean => {
        for (const node of list) {
            if (selectedIds.has(node.id) && node.isLocked) return true;
            if (node.children && containsLockedItems(node.children)) return true;
        }
        return false;
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) {
            showToast("⚠️ Selecione itens nos quadradinhos para excluir!");
            return;
        }
        if (containsLockedItems(nodes)) {
            showToast("🔒 Impossível excluir: Há itens bloqueados na seleção!");
            return;
        }
        setIsDeleteModalOpen(true);
        setIsMenuOpen(false);
    };

    const confirmDelete = () => {
        const filterNodes = (list: NoteNode[]): NoteNode[] => {
            return list
                .filter(node => !selectedIds.has(node.id))
                .map(node => ({
                    ...node,
                    children: node.children ? filterNodes(node.children) : []
                }));
        };
        setNodes(filterNodes(nodes));
        setSelectedIds(new Set());
        setIsDeleteModalOpen(false);
        setActiveNoteId(null);
        showToast("Itens excluídos com sucesso.");
    };

    const toggleFolder = (id: string) => {
        setNodes(updateNodesRecursively(nodes, n => n.id === id && n.type === 'folder' ? { ...n, isOpen: !n.isOpen } : n));
    };

    const updateNoteContent = (html: string) => {
        if (!activeNoteId || activeNote?.isLocked) return;
        setNodes(updateNodesRecursively(nodes, n => n.id === activeNoteId ? { ...n, content: html } : n));
    };

    const toggleLock = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setNodes(updateNodesRecursively(nodes, n => n.id === id ? { ...n, isLocked: !n.isLocked } : n));
    };

    const toggleSelection = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const newSelection = new Set(selectedIds);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedIds(newSelection);
    };

    const startEditing = (e: React.MouseEvent, node: NoteNode) => {
        e.stopPropagation();
        if (node.isLocked) { showToast("🔒 Destranque o item para renomear."); return; }
        setEditingId(node.id);
        setTempName(node.name);
    };

    const saveName = () => {
        if (editingId) {
            setNodes(updateNodesRecursively(nodes, n => n.id === editingId ? { ...n, name: tempName } : n));
            setEditingId(null);
        }
    };

    // --- RENDER ---
    return (
        <>
            <div
                ref={windowRef}
                style={isMinimized ? windowStyle : undefined}
                className={`
            fixed bg-zinc-800 border border-zinc-600 shadow-2xl flex flex-col overflow-hidden ease-in-out z-50 rounded-t-lg
            ${isMinimized ? 'bottom-0 right-4 w-72 h-12' : 'top-32 bottom-0 right-4 w-[90vw] md:w-[800px] border-b-0'}
        `}
            >
                <div
                    className="flex items-center justify-between px-4 h-12 bg-zinc-800 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors"
                    onClick={isMinimized ? onMaximize : undefined}
                >
                    <div className="flex items-center gap-2 text-orange-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" /></svg>
                        <h2 className="text-sm font-bold text-white">Minhas Notas</h2>
                    </div>
                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <button onClick={isMinimized ? onMaximize : onMinimize} className="p-1 hover:bg-zinc-600 rounded text-gray-400 hover:text-white transition">{isMinimized ? '🔼' : '➖'}</button>
                        <button onClick={onClose} className="p-1 hover:bg-red-900/50 hover:text-red-200 rounded text-gray-400 transition">✖</button>
                    </div>
                </div>

                {!isMinimized && (
                    <div className="flex flex-1 overflow-hidden bg-zinc-900">

                        {/* SIDEBAR */}
                        <div
                            className={`w-1/3 border-r border-zinc-700 bg-zinc-800/50 flex flex-col ${dropTargetId === 'ROOT' ? 'bg-orange-500/10' : ''}`}
                            onDragOver={handleDragOverRoot}
                            onDrop={handleDrop}
                        >
                            <div className="p-2 border-b border-zinc-700 flex justify-between items-center relative">
                                <span className="text-xs font-bold text-gray-500 uppercase">Arquivos</span>
                                <div className="relative" ref={menuRef}>
                                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white p-1 hover:bg-zinc-600 rounded rotate-90">•••</button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-zinc-800 border border-zinc-600 rounded shadow-xl z-50 py-1">
                                            <button onClick={createNewNote} className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-zinc-700 hover:text-white">Nova Nota</button>
                                            <button onClick={handleDeleteSelected} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/30">Excluir</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-600">
                                <NoteTree
                                    nodes={nodes}
                                    selectedIds={selectedIds}
                                    activeNoteId={activeNoteId}
                                    editingId={editingId}
                                    tempName={tempName}
                                    draggedNodeId={draggedNodeId}
                                    dropTargetId={dropTargetId}
                                    dropPosition={dropPosition}
                                    onToggleFolder={toggleFolder}
                                    onSelectNote={setActiveNoteId}
                                    onStartEditing={startEditing}
                                    onSaveName={saveName}
                                    onChangeTempName={setTempName}
                                    onCancelEditing={() => setEditingId(null)}
                                    onToggleLock={toggleLock}
                                    onToggleSelection={toggleSelection}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                />
                            </div>
                        </div>

                        {/* EDITOR */}
                        <div className="w-2/3 flex flex-col relative bg-zinc-900">
                            {activeNote ? (
                                <>
                                    <div className="px-4 py-2 border-b border-zinc-700 bg-zinc-800/30 flex items-center justify-between">
                                        <input
                                            className={`bg-transparent font-semibold focus:outline-none w-full ${activeNote.isLocked ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200'}`}
                                            value={activeNote.name}
                                            readOnly={activeNote.isLocked}
                                            onChange={(e) => {
                                                if (activeNote.isLocked) return;
                                                const newName = e.target.value;
                                                const updateName = (l: NoteNode[]): NoteNode[] => l.map(n => n.id === activeNote.id ? { ...n, name: newName } : (n.children ? { ...n, children: updateName(n.children) } : n));
                                                setNodes(updateName(nodes));
                                            }}
                                        />
                                        {activeNote.isLocked && <span className="text-xs text-red-500 flex items-center gap-1">🔒 Bloqueado</span>}
                                    </div>
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        <NoteEditor
                                            content={activeNote.content || ''}
                                            onChange={(newHtml) => updateNoteContent(newHtml)}
                                            editable={!activeNote.isLocked}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4"><div className="text-4xl opacity-50">📜</div><p>Nenhuma nota selecionada</p><button onClick={createNewNote} className="bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 px-6 rounded-full transition shadow-lg shadow-orange-900/20">Criar nova nota</button></div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-[#1e1e1e] border border-gray-700 rounded-xl shadow-2xl p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-orange-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg><h3 className="text-lg font-bold text-white">Deletar {selectedIds.size} item(ns)</h3></div>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <p className="text-gray-300 text-sm mb-6">Tem certeza que deseja excluir os itens selecionados? <br />Essa ação <b>não pode ser desfeita</b>.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-lg font-bold text-gray-300 bg-zinc-700 hover:bg-zinc-600 transition-all">Cancelar</button>
                            <button onClick={confirmDelete} className="flex-1 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all">Sim, Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-zinc-800 border border-orange-500/50 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 flex items-center gap-2">
                    <span className="text-xl">🔔</span><span className="font-medium text-sm">{toastMessage}</span>
                </div>
            )}
        </>
    );
}
