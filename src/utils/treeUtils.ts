import type { NoteNode } from '../types';

/**
 * Encontra recursivamente um nó na árvore pelo ID.
 */
export const findNote = (id: string, list: NoteNode[]): NoteNode | null => {
    for (const item of list) {
        if (item.id === id) return item;
        if (item.children) {
            const found = findNote(id, item.children);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Atualiza recursivamente nós na árvore usando uma função de atualização.
 */
export const updateNodesRecursively = (
    list: NoteNode[],
    updateFn: (node: NoteNode) => NoteNode
): NoteNode[] => {
    return list.map(node => {
        const updatedNode = updateFn(node);
        if (updatedNode.children) {
            return { ...updatedNode, children: updateNodesRecursively(updatedNode.children, updateFn) };
        }
        return updatedNode;
    });
};

/**
 * Verifica se um nó é descendente de outro.
 */
export const isDescendant = (parentId: string, targetId: string, list: NoteNode[]): boolean => {
    const parent = findNote(parentId, list);
    if (!parent || !parent.children) return false;

    const checkChildren = (children: NoteNode[]): boolean => {
        for (const child of children) {
            if (child.id === targetId) return true;
            if (child.children && checkChildren(child.children)) return true;
        }
        return false;
    }
    return checkChildren(parent.children);
};

/**
 * Remove um nó da árvore recursivamente.
 */
export const removeNode = (list: NoteNode[], idToRemove: string): { newList: NoteNode[], removedNode: NoteNode | null } => {
    let removedNode: NoteNode | null = null;

    const filterNodes = (nodes: NoteNode[]): NoteNode[] => {
        return nodes.filter(node => {
            if (node.id === idToRemove) {
                removedNode = node;
                return false;
            }
            if (node.children) {
                node.children = filterNodes(node.children);
            }
            return true;
        });
    };

    const newList = filterNodes(JSON.parse(JSON.stringify(list)));
    return { newList, removedNode };
};

export type DropPosition = 'top' | 'inside' | 'bottom' | null;

/**
 * Insere um nó em uma posição específica relativa a um alvo.
 */
export const insertNode = (
    list: NoteNode[],
    targetId: string,
    pos: DropPosition,
    nodeToInsert: NoteNode
): NoteNode[] => {
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
