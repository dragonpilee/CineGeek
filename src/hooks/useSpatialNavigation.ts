'use client';

import { useEffect, useState, useCallback } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

export const useSpatialNavigation = () => {
    const [focusedId, setFocusedId] = useState<string | null>(null);

    const getFocusableElements = () => {
        return Array.from(document.querySelectorAll('[data-focusable="true"]')) as HTMLElement[];
    };

    const findNextFocus = (currentId: string, direction: Direction): string | null => {
        const currentEl = document.getElementById(currentId);
        if (!currentEl) return null;

        const currentRect = currentEl.getBoundingClientRect();
        const candidates = getFocusableElements().filter(el => el.id !== currentId);

        let bestCandidate: HTMLElement | null = null;
        let minDistance = Infinity;

        for (const candidate of candidates) {
            const rect = candidate.getBoundingClientRect();

            // Filter candidates based on direction
            let isValid = false;
            let distance = Infinity;

            switch (direction) {
                case 'right':
                    if (rect.left >= currentRect.right) { // Strictly to the right
                        // Prioritize elements in the same horizontal row (overlap Y)
                        const yOverlap = Math.min(currentRect.bottom, rect.bottom) - Math.max(currentRect.top, rect.top);
                        if (yOverlap > 0) {
                            isValid = true;
                            distance = rect.left - currentRect.right;
                        }
                    }
                    break;
                case 'left':
                    if (rect.right <= currentRect.left) {
                        const yOverlap = Math.min(currentRect.bottom, rect.bottom) - Math.max(currentRect.top, rect.top);
                        if (yOverlap > 0) {
                            isValid = true;
                            distance = currentRect.left - rect.right;
                        }
                    }
                    break;
                case 'down':
                    if (rect.top >= currentRect.bottom) { // Strictly below
                        // Prioritize elements that align horizontally (overlap X)
                        const xOverlap = Math.min(currentRect.right, rect.right) - Math.max(currentRect.left, rect.left);
                        // Weight vertical distance more heavily, but favor aligned items
                        isValid = true;
                        // Distance formula: Euclidean distance between centers
                        const currentCenter = { x: currentRect.left + currentRect.width / 2, y: currentRect.top + currentRect.height / 2 };
                        const candCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                        distance = Math.sqrt(Math.pow(candCenter.x - currentCenter.x, 2) + Math.pow(candCenter.y - currentCenter.y, 2));

                        // Penalize items that are too far horizontally
                        if (xOverlap <= 0) distance += 1000;
                    }
                    break;
                case 'up':
                    if (rect.bottom <= currentRect.top) {
                        const xOverlap = Math.min(currentRect.right, rect.right) - Math.max(currentRect.left, rect.left);
                        isValid = true;
                        const currentCenter = { x: currentRect.left + currentRect.width / 2, y: currentRect.top + currentRect.height / 2 };
                        const candCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                        distance = Math.sqrt(Math.pow(candCenter.x - currentCenter.x, 2) + Math.pow(candCenter.y - currentCenter.y, 2));
                        if (xOverlap <= 0) distance += 1000;
                    }
                    break;
            }

            if (isValid && distance < minDistance) {
                minDistance = distance;
                bestCandidate = candidate;
            }
        }

        return bestCandidate ? bestCandidate.id : null;
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) return;
            e.preventDefault();

            const elements = getFocusableElements();
            if (elements.length === 0) return;

            if (!focusedId) {
                // Initial focus
                const first = elements[0];
                setFocusedId(first.id);
                first.focus();
                return;
            }

            if (e.key === 'Enter') {
                document.getElementById(focusedId)?.click();
                return;
            }

            // Handle Back Button (Backspace on Firestick/Android TV often maps to this or Escape)
            if (e.key === 'Backspace' || e.key === 'Escape') {
                window.history.back();
                return;
            }

            let direction: Direction | null = null;
            if (e.key === 'ArrowUp') direction = 'up';
            if (e.key === 'ArrowDown') direction = 'down';
            if (e.key === 'ArrowLeft') direction = 'left';
            if (e.key === 'ArrowRight') direction = 'right';

            if (direction) {
                const nextId = findNextFocus(focusedId, direction);
                if (nextId) {
                    setFocusedId(nextId);
                    const el = document.getElementById(nextId);
                    el?.focus();
                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedId]);

    return { focusedId };
};
