import { useState, useEffect, useRef } from 'react';
import type { WindowState, FileNode } from './types';
import { TiptapEditor } from './TiptapEditor';

interface NotesDrawerProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  initialNodes: FileNode[];
  onSave: (nodes: FileNode[]) => void;
}

// Tipo auxiliar para saber onde vamos soltar o item
type DropPosition = 'top' | 'inside' | 'bottom' | null;

export function NotesDrawer({ windowState, onClose, onMinimize, onMaximize, initialNodes, onSave }: NotesDrawerProps) {
  if (windowState === 'CLOSED') return null;

  // Usa os dados que vieram da campanha selecionada (initialNodes)
  const [nodes, setNodes] = useState<FileNode[]>(initialNodes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Estados de Interface
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados de Edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  // Estados de Drag and Drop
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // --- EFEITO DE SALVAMENTO AUTOMÁTICO ---
  // Sempre que 'nodes' mudar aqui dentro, avisa o pai (App.tsx) para salvar
  useEffect(() => {
    onSave(nodes);
  }, [nodes, onSave]);

  // --- OUTROS EFEITOS ---
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

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- LÓGICA DE ÁRVORE ---
  const findNote = (id: string, list: FileNode[]): FileNode | null => {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findNote(id, item.children);
        if (found) return found;
      }
    }
    return null;
  };
  const activeNote = activeNoteId ? findNote(activeNoteId, nodes) : null;

  const updateNodesRecursively = (list: FileNode[], updateFn: (node: FileNode) => FileNode): FileNode[] => {
    return list.map(node => {
      const updatedNode = updateFn(node);
      if (updatedNode.children) {
        return { ...updatedNode, children: updateNodesRecursively(updatedNode.children, updateFn) };
      }
      return updatedNode;
    });
  };

  // --- DRAG AND DROP ---
  const handleDragStart = (e: React.DragEvent, node: FileNode) => {
    e.stopPropagation();
    if (editingId) {
      e.preventDefault();
      return;
    }
    setDraggedNodeId(node.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
  };

  const handleDragOver = (e: React.DragEvent, targetNode: FileNode) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedNodeId || draggedNodeId === targetNode.id) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    let position: DropPosition = null;

    if (targetNode.type === 'folder') {
      if (y < height * 0.25) position = 'top';
      else if (y > height * 0.75) position = 'bottom';
      else position = 'inside';
    } else {
      if (y < height * 0.5) position = 'top';
      else position = 'bottom';
    }

    setDropTargetId(targetNode.id);
    setDropPosition(position);
  };

  const handleDragOverRoot = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      setDropTargetId('ROOT');
      setDropPosition('inside');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedNodeId || !dropTargetId || !dropPosition) {
      resetDragState();
      return;
    }

    if (draggedNodeId === dropTargetId) { resetDragState(); return; }

    if (isDescendant(draggedNodeId, dropTargetId, nodes)) {
      showToast("🚫 Não pode mover uma pasta para dentro dela mesma.");
      resetDragState();
      return;
    }

    const newTree = JSON.parse(JSON.stringify(nodes));
    let draggedItem: FileNode | null = null;

    const removeNode = (list: FileNode[]): FileNode[] => {
      return list.filter(node => {
        if (node.id === draggedNodeId) {
          draggedItem = node;
          return false;
        }
        if (node.children) {
          node.children = removeNode(node.children);
        }
        return true;
      });
    };

    let treeWithoutItem = removeNode(newTree);

    if (!draggedItem) { resetDragState(); return; }

    if (dropTargetId === 'ROOT') {
      treeWithoutItem.push(draggedItem);
    } else {
      treeWithoutItem = insertNode(treeWithoutItem, dropTargetId, dropPosition, draggedItem!);
    }

    setNodes(treeWithoutItem);
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedNodeId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const isDescendant = (parentId: string, targetId: string, list: FileNode[]): boolean => {
    const parent = findNote(parentId, list);
    if (!parent || !parent.children) return false;
    const checkChildren = (children: FileNode[]): boolean => {
      for (const child of children) {
        if (child.id === targetId) return true;
        if (child.children && checkChildren(child.children)) return true;
      }
      return false;
    }
    return checkChildren(parent.children);
  };

  const insertNode = (list: FileNode[], targetId: string, pos: DropPosition, nodeToInsert: FileNode): FileNode[] => {
    const targetIndex = list.findIndex(n => n.id === targetId);

    if (targetIndex !== -1 && (pos === 'top' || pos === 'bottom')) {
      const newList = [...list];
      const insertAt = pos === 'top' ? targetIndex : targetIndex + 1;
      newList.splice(insertAt, 0, nodeToInsert);
      return newList;
    }

    return list.map(node => {
      if (node.id === targetId && pos === 'inside') {
        return {
          ...node,
          isOpen: true,
          children: [...(node.children || []), nodeToInsert]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: insertNode(node.children, targetId, pos, nodeToInsert)
        };
      }
      return node;
    });
  };

  // --- AÇÕES ---
  const createNewNote = () => {
    const newNote: FileNode = { id: Date.now().toString(), name: 'Nova Nota', type: 'file', content: '', isLocked: false };
    setNodes([...nodes, newNote]);
    setActiveNoteId(newNote.id);
    setIsMenuOpen(false);
  };

  const containsLockedItems = (list: FileNode[]): boolean => {
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
    const filterNodes = (list: FileNode[]): FileNode[] => {
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

  const startEditing = (e: React.MouseEvent, node: FileNode) => {
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

  // --- RENDERIZADOR ---
  const renderTree = (list: FileNode[]) => list.map(node => {
    const isSelected = selectedIds.has(node.id);
    const isActive = activeNoteId === node.id;
    const isEditing = editingId === node.id;

    const isDragSource = draggedNodeId === node.id;
    const isDropTarget = dropTargetId === node.id;

    let dropIndicatorClass = '';
    if (isDropTarget && !isDragSource) {
      if (dropPosition === 'top') dropIndicatorClass = 'border-t-2 border-t-orange-500';
      if (dropPosition === 'bottom') dropIndicatorClass = 'border-b-2 border-b-orange-500';
      if (dropPosition === 'inside') dropIndicatorClass = 'bg-orange-500/20 border-2 border-orange-500';
    }

    return (
      <div key={node.id} className={`ml-2 select-none ${isDragSource ? 'opacity-40' : 'opacity-100'}`}>
        <div
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={(e) => handleDragOver(e, node)}
          onDrop={handleDrop}

          className={`
              group flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-all relative
              border border-transparent ${dropIndicatorClass}
              ${isActive ? 'bg-orange-500/20 text-orange-200' : 'text-gray-300 hover:bg-zinc-700'}
              ${isSelected ? 'bg-zinc-700 ring-1 ring-zinc-500' : ''}
            `}
          onClick={() => node.type === 'folder' ? toggleFolder(node.id) : setActiveNoteId(node.id)}
        >
          <div
            onClick={(e) => toggleSelection(e, node.id)}
            className={`flex items-center justify-center w-4 h-4 rounded border border-gray-500 hover:bg-zinc-600 ${isSelected ? 'opacity-100 bg-orange-600 border-orange-600' : 'opacity-0 group-hover:opacity-100 bg-transparent'} transition-opacity duration-200`}
          >
            {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
          </div>

          <span className="opacity-70 text-xs">{node.type === 'folder' ? (node.isOpen ? '📂' : '📁') : '📄'}</span>

          {isEditing ? (
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingId(null); }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-zinc-950 text-white text-xs px-1 py-0.5 rounded border border-orange-500 focus:outline-none min-w-[60px]"
            />
          ) : (
            <span className="flex-1 truncate" onDoubleClick={(e) => startEditing(e, node)} title="Duplo clique para renomear">
              {node.name}
            </span>
          )}

          <button onClick={(e) => toggleLock(e, node.id)} className={`p-1 rounded hover:bg-zinc-600 transition-opacity duration-200 ${node.isLocked ? 'opacity-100 text-red-400' : 'opacity-0 group-hover:opacity-40 hover:!opacity-100 text-gray-400'}`} title={node.isLocked ? "Destrancar" : "Trancar"}>
            {node.isLocked ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z" /></svg>}
          </button>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && <div className="border-l border-zinc-700 ml-2 pl-1">{renderTree(node.children)}</div>}
      </div>
    );
  });

  return (
    <>
      <div className={`fixed right-4 md:right-10 bg-zinc-800 border border-zinc-600 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-50 rounded-t-lg ${windowState === 'MINIMIZED' ? 'bottom-0 w-72 h-12' : 'bottom-0 w-[90vw] md:w-[800px] h-[600px]'}`}>
        <div className="flex items-center justify-between px-4 h-12 bg-zinc-800 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors" onClick={windowState === 'MINIMIZED' ? onMaximize : undefined}>
          <div className="flex items-center gap-2 text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" /></svg>
            <h2 className="text-sm font-bold text-white">Minhas Notas</h2>
          </div>
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            <button onClick={windowState === 'MINIMIZED' ? onMaximize : onMinimize} className="p-1 hover:bg-zinc-600 rounded text-gray-400 hover:text-white transition">{windowState === 'MINIMIZED' ? '🔼' : '➖'}</button>
            <button onClick={onClose} className="p-1 hover:bg-red-900/50 hover:text-red-200 rounded text-gray-400 transition">✖</button>
          </div>
        </div>

        {windowState === 'OPEN' && (
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
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-600">{renderTree(nodes)}</div>
            </div>

            {/* EDITOR */}
            <div className="w-2/3 flex flex-col relative bg-zinc-900">
              {activeNote ? (
                <>
                  <div className="px-4 py-2 border-b border-zinc-700 bg-zinc-800/30 flex items-center justify-between">
                    <input className={`bg-transparent font-semibold focus:outline-none w-full ${activeNote.isLocked ? 'text-gray-500 cursor-not-allowed' : 'text-gray-200'}`} value={activeNote.name} readOnly={activeNote.isLocked} onChange={(e) => { if (activeNote.isLocked) return; const newName = e.target.value; const updateName = (l: FileNode[]): FileNode[] => l.map(n => n.id === activeNote.id ? { ...n, name: newName } : (n.children ? { ...n, children: updateName(n.children) } : n)); setNodes(updateName(nodes)); }} />
                    {activeNote.isLocked && <span className="text-xs text-red-500 flex items-center gap-1">🔒 Bloqueado</span>}
                  </div>
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <TiptapEditor
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