import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { useEffect } from 'react';

interface NoteEditorProps {
    content: string;
    onChange: (html: string) => void;
    editable?: boolean;
}

// Botão simples da Toolbar
const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title
}: { onClick: () => void, isActive?: boolean, children: React.ReactNode, title?: string }) => (
    <button
        onClick={onClick}
        title={title}
        className={`
      p-1.5 rounded text-sm font-medium transition-colors
      ${isActive
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-400 hover:bg-zinc-700 hover:text-white'}
    `}
    >
        {children}
    </button>
);

export function NoteEditor({ content, onChange, editable = true }: NoteEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight.configure({ multicolor: true }),
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-gray-300 leading-relaxed custom-editor',
            },
        },
    });

    // Atualiza o conteúdo se trocarmos de nota
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    // Atualiza estado de "bloqueado" (editable)
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900">

            {/* BARRA DE FERRAMENTAS (Só aparece se editável) */}
            {editable && (
                <div className="flex flex-wrap items-center gap-1 px-4 py-2 border-b border-zinc-700 bg-zinc-800/50">

                    {/* Títulos */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Título 1"
                    >
                        H1
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Título 2"
                    >
                        H2
                    </MenuButton>

                    <div className="w-px h-5 bg-zinc-600 mx-1 self-center" />

                    {/* Formatação Básica */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Negrito"
                    >
                        <span className="font-bold">B</span>
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Itálico"
                    >
                        <span className="italic">I</span>
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Sublinhado"
                    >
                        <span className="underline">U</span>
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Tachado"
                    >
                        <span className="line-through">S</span>
                    </MenuButton>

                    <div className="w-px h-5 bg-zinc-600 mx-1 self-center" />

                    {/* Listas e Citação */}
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Lista de Pontos"
                    >
                        • Lista
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Citação"
                    >
                        ❝
                    </MenuButton>

                    <div className="w-px h-5 bg-zinc-600 mx-1 self-center" />

                    {/* Divisor Horizontal */}
                    <MenuButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Linha Divisória"
                    >
                        ―
                    </MenuButton>

                </div>
            )}

            {/* ÁREA DE TEXTO */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
