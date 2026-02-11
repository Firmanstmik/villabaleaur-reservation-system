import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';

interface SortableImageProps {
    url: string;
    index: number;
    onRemove: (index: number) => void;
}

export function SortableImage({ url, index, onRemove }: SortableImageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative aspect-video rounded-[2rem] overflow-hidden border border-border shadow-md bg-white transition-shadow hover:shadow-xl"
        >
            <img
                src={url}
                alt="Property"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
            />

            {/* Grip Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 right-4 z-20"
            >
                <div className="p-2 bg-white/90 backdrop-blur-md rounded-xl text-[#0e2e50] shadow-lg hover:bg-white transition-colors cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} />
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                    }}
                    className="w-12 h-12 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                >
                    <Trash2 size={20} />
                </Button>
            </div>

            {index === 0 && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-[#0e2e50] text-white rounded-xl text-[10px] font-black shadow-xl uppercase tracking-[0.2em] border border-white/10 z-10">
                    Main Cover
                </div>
            )}
        </div>
    );
}
