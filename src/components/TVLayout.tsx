'use client';

import { useSpatialNavigation } from '@/hooks/useSpatialNavigation';
import Navbar from './Navbar';
import { ReactNode } from 'react';

export default function TVLayout({ children }: { children: ReactNode }) {
    useSpatialNavigation();

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden flex">
            <Navbar />
            <div className="flex-1 ml-20 flex flex-col overflow-x-hidden">
                <div className="flex-1 overflow-x-hidden">
                    {children}
                </div>
                <footer className="py-6 text-center text-zinc-600 text-xs font-medium">
                    <p>Developed by Cinegeek</p>
                    <p className="mt-1 opacity-75">Optimized for Fire TV & Google TV</p>
                </footer>
            </div>
        </div>
    );
}
