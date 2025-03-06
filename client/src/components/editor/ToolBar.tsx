// The whole toolbar for the TipTap styled with lucide-icons read doc here https://lucide.dev/guide/installation

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";
import {
    Bold,
    Code,
    Heading2,
    Italic,
    List,
    ListOrdered,
    type LucideIcon,
    Quote,
    Redo,
    Strikethrough,
    Underline,
    Undo,
} from "lucide-react";

interface ToolbarProps {
    editor: Editor | null;
}

interface ToolbarItem {
    icon: LucideIcon;
    action: () => boolean;
    isActive: boolean;
}

const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) {
        return null;
    }

    const toolbarItems: ToolbarItem[] = [
        {
            icon: Bold,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive("bold"),
        },
        {
            icon: Italic,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive("italic"),
        },
        {
            icon: Underline,
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: editor.isActive("underline"),
        },
        {
            icon: Strikethrough,
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive("strike"),
        },
        {
            icon: Heading2,
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive("heading", { level: 2 }),
        },
        {
            icon: List,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList"),
        },
        {
            icon: ListOrdered,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList"),
        },
        {
            icon: Quote,
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive("blockquote"),
        },
        {
            icon: Code,
            action: () => editor.chain().focus().setCode().run(),
            isActive: editor.isActive("code"),
        },
    ];

    return (
        <div className="rounded-t-lg border border-border bg-background">
            <div className="flex flex-wrap items-center gap-2">
                <ToggleGroup type="multiple" className="justify-start">
                    {toolbarItems.map((item, index) => (
                        <ToggleGroupItem
                            key={index}
                            value={item.icon.name}
                            aria-label={`Toggle ${item.icon.name}`}
                            data-state={item.isActive ? "on" : "off"}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                item.action();
                            }}
                            className={cn(
                                "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                                "hover:bg-muted",
                                "transition-colors",
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            editor.chain().focus().undo().run();
                        }}
                        disabled={!editor.can().undo()}
                    >
                        <Undo className="h-4 w-4" />
                        <span className="sr-only">Undo</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            editor.chain().focus().redo().run();
                        }}
                        disabled={!editor.can().redo()}
                    >
                        <Redo className="h-4 w-4" />
                        <span className="sr-only">Redo</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
