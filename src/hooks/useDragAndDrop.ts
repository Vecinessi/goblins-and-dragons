import { useState } from 'react';
import type { NoteNode } from '../types';
import type { DropPosition } from '../utils/treeUtils';
import { isDescendant, insertNode, removeNode } from '../utils/treeUtils';

export function useDragAndDrop(
    nodes: NoteNode[],
    setNodes: (nodes: NoteNode[]) => void,
    onDragError: (msg: string) => void
) {
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const [dropTargetId, setDropTargetId] = useState<string | null>(null);
    const [dropPosition, setDropPosition] = useState<DropPosition>(null);

    const resetDragState = () => {
        setDraggedNodeId(null);
        setDropTargetId(null);
        setDropPosition(null);
    };

    const handleDragStart = (e: React.DragEvent, node: NoteNode) => {
        e.stopPropagation();
        setDraggedNodeId(node.id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', node.id);
    };

    const handleDragOver = (e: React.DragEvent, targetNode: NoteNode) => {
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

        if (dropTargetId !== 'ROOT' && isDescendant(draggedNodeId, dropTargetId, nodes)) {
            onDragError("🚫 Não pode mover uma pasta para dentro dela mesma.");
            resetDragState();
            return;
        }

        // Remove the node from its current position
        const { newList: treeWithoutItem, removedNode: draggedItem } = removeNode(nodes, draggedNodeId);

        if (!draggedItem) { resetDragState(); return; }

        let finalTree: NoteNode[];

        if (dropTargetId === 'ROOT') {
            finalTree = [...treeWithoutItem, draggedItem];
        } else {
            finalTree = insertNode(treeWithoutItem, dropTargetId, dropPosition, draggedItem);
        }

        setNodes(finalTree);
        resetDragState();
    };

    return {
        isDragging: !!draggedNodeId,
        draggedNodeId,
        dropTargetId,
        dropPosition,
        handleDragStart,
        handleDragOver,
        handleDragOverRoot,
        handleDrop
    };
}
