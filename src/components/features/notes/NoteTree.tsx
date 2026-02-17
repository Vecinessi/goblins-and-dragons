import type { NoteNode } from '../../../types';
import type { DropPosition } from '../../../utils/treeUtils';
import React from 'react';

interface NoteTreeProps {
    nodes: NoteNode[];
    selectedIds: Set<string>;
    activeNoteId: string | null;
    editingId: string | null;
    tempName: string;
    draggedNodeId: string | null;
    dropTargetId: string | null;
    dropPosition: DropPosition;

    onToggleFolder: (id: string) => void;
    onSelectNote: (id: string) => void;
    onStartEditing: (e: React.MouseEvent, node: NoteNode) => void;
    onSaveName: (e?: React.KeyboardEvent | React.FocusEvent) => void;
    onChangeTempName: (name: string) => void;
    onCancelEditing: () => void;
    onToggleLock: (e: React.MouseEvent, id: string) => void;
    onToggleSelection: (e: React.MouseEvent, id: string) => void;

    onDragStart: (e: React.DragEvent, node: NoteNode) => void;
    onDragOver: (e: React.DragEvent, node: NoteNode) => void;
    onDrop: (e: React.DragEvent) => void;
}

export const NoteTree: React.FC<NoteTreeProps> = ({
    nodes,
    selectedIds,
    activeNoteId,
    editingId,
    tempName,
    draggedNodeId,
    dropTargetId,
    dropPosition,

    onToggleFolder,
    onSelectNote,
    onStartEditing,
    onSaveName,
    onChangeTempName,
    onCancelEditing,
    onToggleLock,
    onToggleSelection,
    onDragStart,
    onDragOver,
    onDrop
}) => {

    return (
        <>
            {nodes.map(node => {
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
                            onDragStart={(e) => onDragStart(e, node)}
                            onDragOver={(e) => onDragOver(e, node)}
                            onDrop={onDrop}
                            className={`
                  group flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer transition-all relative
                  border border-transparent ${dropIndicatorClass}
                  ${isActive ? 'bg-orange-500/20 text-orange-200' : 'text-gray-300 hover:bg-zinc-700'}
                  ${isSelected ? 'bg-zinc-700 ring-1 ring-zinc-500' : ''}
                `}
                            onClick={() => node.type === 'folder' ? onToggleFolder(node.id) : onSelectNote(node.id)}
                        >
                            <div
                                onClick={(e) => onToggleSelection(e, node.id)}
                                className={`flex items-center justify-center w-4 h-4 rounded border border-gray-500 hover:bg-zinc-600 ${isSelected ? 'opacity-100 bg-orange-600 border-orange-600' : 'opacity-0 group-hover:opacity-100 bg-transparent'} transition-opacity duration-200`}
                            >
                                {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>

                            <span className="opacity-70 text-xs">{node.type === 'folder' ? (node.isOpen ? '📂' : '📁') : '📄'}</span>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => onChangeTempName(e.target.value)}
                                    onBlur={onSaveName}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') onSaveName(e);
                                        if (e.key === 'Escape') onCancelEditing();
                                    }}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 bg-zinc-950 text-white text-xs px-1 py-0.5 rounded border border-orange-500 focus:outline-none min-w-[60px]"
                                />
                            ) : (
                                <span className="flex-1 truncate" onDoubleClick={(e) => onStartEditing(e, node)} title="Duplo clique para renomear">
                                    {node.name}
                                </span>
                            )}

                            <button onClick={(e) => onToggleLock(e, node.id)} className={`p-1 rounded hover:bg-zinc-600 transition-opacity duration-200 ${node.isLocked ? 'opacity-100 text-red-400' : 'opacity-0 group-hover:opacity-40 hover:!opacity-100 text-gray-400'}`} title={node.isLocked ? "Destrancar" : "Trancar"}>
                                {node.isLocked ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2z" /></svg>}
                            </button>
                        </div>

                        {/* Recursion for children */}
                        {node.type === 'folder' && node.isOpen && node.children && (
                            <div className="border-l border-zinc-700 ml-2 pl-1">
                                <NoteTree
                                    nodes={node.children}
                                    selectedIds={selectedIds}
                                    activeNoteId={activeNoteId}
                                    editingId={editingId}
                                    tempName={tempName}
                                    draggedNodeId={draggedNodeId}
                                    dropTargetId={dropTargetId}
                                    dropPosition={dropPosition}
                                    onToggleFolder={onToggleFolder}
                                    onSelectNote={onSelectNote}
                                    onStartEditing={onStartEditing}
                                    onSaveName={onSaveName}
                                    onChangeTempName={onChangeTempName}
                                    onCancelEditing={onCancelEditing}
                                    onToggleLock={onToggleLock}
                                    onToggleSelection={onToggleSelection}
                                    onDragStart={onDragStart}
                                    onDragOver={onDragOver}
                                    onDrop={onDrop}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};
