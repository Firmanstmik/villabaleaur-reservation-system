/**
 * Lightweight Tiptap JSON renderer — zero Tiptap dependency.
 * Recursively maps JSON content nodes to React elements.
 * Only known node types are rendered; unknown types are silently skipped (XSS safe).
 */
import React from 'react';

interface JSONContent {
    type?: string;
    attrs?: Record<string, any>;
    content?: JSONContent[];
    marks?: { type: string; attrs?: Record<string, any> }[];
    text?: string;
}

interface DescriptionRendererProps {
    json: JSONContent;
    className?: string;
}

function renderMarks(text: string, marks?: JSONContent['marks']): React.ReactNode {
    if (!marks || marks.length === 0) return text;

    let node: React.ReactNode = text;
    for (const mark of marks) {
        if (mark.type === 'bold') {
            node = <strong className="font-semibold text-foreground">{node}</strong>;
        } else if (mark.type === 'italic') {
            node = <em>{node}</em>;
        }
    }
    return node;
}

function renderNode(node: JSONContent, index: number): React.ReactNode {
    // Text node
    if (node.type === 'text' && node.text) {
        return <React.Fragment key={index}>{renderMarks(node.text, node.marks)}</React.Fragment>;
    }

    const children = node.content?.map((child, i) => renderNode(child, i));

    switch (node.type) {
        case 'doc':
            return <>{children}</>;

        case 'paragraph':
            return (
                <p key={index} className="mb-5 last:mb-0">
                    {children || '\u00A0'}
                </p>
            );

        case 'heading': {
            const level = node.attrs?.level ?? 2;
            if (level === 2) {
                return (
                    <h2 key={index} className="text-xl font-bold text-foreground mt-10 mb-4 first:mt-0">
                        {children}
                    </h2>
                );
            }
            return (
                <h3 key={index} className="text-lg font-semibold text-foreground mt-8 mb-3 first:mt-0">
                    {children}
                </h3>
            );
        }

        case 'bulletList':
            return (
                <ul key={index} className="list-disc pl-6 mb-5 space-y-1.5">
                    {children}
                </ul>
            );

        case 'orderedList':
            return (
                <ol key={index} className="list-decimal pl-6 mb-5 space-y-1.5">
                    {children}
                </ol>
            );

        case 'listItem':
            return (
                <li key={index} className="leading-relaxed">
                    {children}
                </li>
            );

        case 'horizontalRule':
            return <hr key={index} className="border-t border-border/40 my-10" />;

        case 'hardBreak':
            return <br key={index} />;

        default:
            // Unknown node types are silently skipped (XSS safety)
            return null;
    }
}

export function DescriptionRenderer({ json, className }: DescriptionRendererProps) {
    return (
        <div className={`max-w-[680px] text-lg leading-[1.75] text-muted-foreground ${className || ''}`}>
            {renderNode(json, 0)}
        </div>
    );
}
