import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardTransitionProps {
    children: React.ReactNode;
}

// Store the page user was on before entering any dashboard
const RETURN_URL_KEY = 'dashboard_return_url';

export function storeReturnUrl() {
    const current = window.location.pathname;
    if (!current.includes('/dashboard')) {
        sessionStorage.setItem(RETURN_URL_KEY, current);
    }
}

export function getReturnUrl(language: string): string {
    return sessionStorage.getItem(RETURN_URL_KEY) || `/${language}/`;
}

type ExitAnimation = 'flip' | 'slide-right' | null;

export function DashboardTransition({ children }: DashboardTransitionProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [exitAnimation, setExitAnimation] = useState<ExitAnimation>(null);

    // Determine if we arrived via a flip (from the other dashboard) or slide-in (from navbar)
    const cameFromFlip = (location.state as any)?.flip === true;
    const cameFromSlideIn = (location.state as any)?.slideIn === true;

    const handleFlipTo = useCallback((targetPath: string) => {
        setExitAnimation('flip');
        setTimeout(() => {
            navigate(targetPath, { state: { flip: true } });
        }, 300);
    }, [navigate]);

    const handleSlideClose = useCallback(() => {
        setExitAnimation('slide-right');
        setTimeout(() => {
            const returnUrl = getReturnUrl(language);
            navigate(returnUrl);
        }, 350);
    }, [navigate, language]);

    // Animation variants
    const getAnimationProps = () => {
        // Exit: flip out
        if (exitAnimation === 'flip') {
            return {
                animate: { rotateY: 90, opacity: 0 },
                transition: { duration: 0.3, ease: 'easeIn' },
            };
        }

        // Exit: slide right
        if (exitAnimation === 'slide-right') {
            return {
                animate: { x: '100%', opacity: 0 },
                transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
            };
        }

        // Enter: slide in from right (from navbar dropdown)
        if (cameFromSlideIn) {
            return {
                initial: { x: '100%' },
                animate: { x: 0 },
                transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
            };
        }

        // Enter: flip in (from the other dashboard)
        if (cameFromFlip) {
            return {
                initial: { rotateY: -90, opacity: 0 },
                animate: { rotateY: 0, opacity: 1 },
                transition: { duration: 0.3, ease: 'easeOut' },
            };
        }

        // Default enter: no animation (normal page load)
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.15 },
        };
    };

    return (
        <motion.div
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
            className="min-h-screen"
            {...getAnimationProps()}
        >
            {typeof children === 'function'
                ? (children as any)({ handleFlipTo, handleSlideClose })
                : children
            }
        </motion.div>
    );
}

// Hook for dashboard pages to access transition controls
export function useDashboardTransition() {
    const location = useLocation();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [exitAnimation, setExitAnimation] = useState<ExitAnimation>(null);

    const cameFromFlip = (location.state as any)?.flip === true;
    const cameFromSlideIn = (location.state as any)?.slideIn === true;

    const flipTo = useCallback((targetPath: string) => {
        setExitAnimation('flip');
        setTimeout(() => {
            navigate(targetPath, { state: { flip: true } });
        }, 300);
    }, [navigate]);

    const slideClose = useCallback(() => {
        setExitAnimation('slide-right');
        setTimeout(() => {
            const returnUrl = getReturnUrl(language);
            navigate(returnUrl);
        }, 350);
    }, [navigate, language]);

    const getMotionProps = () => {
        if (exitAnimation === 'flip') {
            return {
                animate: { rotateY: 90, opacity: 0 },
                transition: { duration: 0.3, ease: 'easeIn' as const },
            };
        }
        if (exitAnimation === 'slide-right') {
            return {
                animate: { x: '100%', opacity: 0 },
                transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
            };
        }
        if (cameFromSlideIn) {
            return {
                initial: { x: '100%' },
                animate: { x: 0 },
                transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
            };
        }
        if (cameFromFlip) {
            return {
                initial: { rotateY: -90, opacity: 0 },
                animate: { rotateY: 0, opacity: 1 },
                transition: { duration: 0.3, ease: 'easeOut' as const },
            };
        }
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.15 },
        };
    };

    return { flipTo, slideClose, getMotionProps, exitAnimation };
}
