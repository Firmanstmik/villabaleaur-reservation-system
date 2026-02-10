import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
    images: string[];
    initialIndex: number;
    isOpen: boolean;
    onClose: () => void;
}

export function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex]);

    // Lock scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const showNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const showPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, showNext, showPrev]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-[110] p-2 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full"
                >
                    <X size={28} />
                </button>

                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); showPrev(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-3 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full hidden md:flex"
                >
                    <ChevronLeft size={44} />
                </button>

                <button
                    onClick={(e) => { e.stopPropagation(); showNext(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-3 text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full hidden md:flex"
                >
                    <ChevronRight size={44} />
                </button>

                {/* Main Image Container */}
                <div
                    className="relative w-full h-full flex flex-col items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header Space for Close Button Padding */}
                    <div className="h-16 w-full" />

                    {/* Image Area */}
                    <div className="relative flex-1 w-full flex items-center justify-center min-h-0 px-4 md:px-12">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15, ease: 'linear' }}
                                className="max-w-full max-h-full w-auto h-auto object-contain select-none shadow-2xl"
                                style={{
                                    maxHeight: 'calc(100vh - 180px)', // Leave space for thumbnails and header
                                    width: 'auto',
                                    height: 'auto'
                                }}
                                alt={`Property ${currentIndex + 1}`}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Thumbnail Strip (Desktop & Tablet) */}
                    <div className="hidden sm:flex w-full overflow-x-auto py-6 scrollbar-hide gap-3 justify-center px-4">
                        <div className="flex gap-3 min-w-max">
                            {images.map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    onMouseEnter={() => setCurrentIndex(idx)}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentIndex === idx
                                        ? 'border-white ring-2 ring-white/20 scale-105 z-10'
                                        : 'border-transparent opacity-40 hover:opacity-80'
                                        }`}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
                                    {currentIndex === idx && (
                                        <motion.div
                                            layoutId="activeThumb"
                                            className="absolute inset-0 bg-white/5"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
