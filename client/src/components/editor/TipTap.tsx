// Post creating canvas
// Uses a third party library TipTap
// Quite easy to use must refer docs at https://www.npmjs.com/package/@tiptap/react


import Toolbar from "@/components/editor/ToolBar";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

type TiptapProps = {
    onChange: (content: string) => void;
    content: string;
    className?: string;
};

const Tiptap = ({ onChange, content, className }: TiptapProps) => {
    const editor = useEditor({
        extensions: [StarterKit, Underline],
        content: content,
        editorProps: {
            attributes: {
                class: `flex flex-col px-4 py-3 justify-start border-b border-r border-l border-gray-200 text-gray-800 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none ${className}`,
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="w-full">
            <Toolbar editor={editor} />
            <EditorContent style={{ whiteSpace: "pre-line" }} editor={editor} />
        </div>
    );
};

export default Tiptap;
