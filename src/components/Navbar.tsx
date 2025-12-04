'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Flame, Film, Tv } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Movies', href: '/movies', icon: Film },
        { name: 'Series', href: '/series', icon: Tv },
        { name: 'Search', href: '/search', icon: Search },
    ];

    return (
        <nav className="fixed left-0 top-0 h-screen w-20 bg-black/90 backdrop-blur-md flex flex-col items-center py-8 z-50 border-r border-zinc-800">
            <div className="mb-8 text-red-600 flex flex-col items-center text-center">
                <Flame size={32} fill="currentColor" />
                <span className="text-[10px] font-bold mt-1 tracking-widest">FIREGEEK</span>
                <span className="text-[8px] text-zinc-500 font-medium">by Cinegeek</span>
            </div>
            <div className="flex flex-col gap-6 w-full px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            id={`nav-${item.name.toLowerCase()}`}
                            data-focusable="true"
                            className={clsx(
                                'flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 focus:bg-white focus:text-black outline-none',
                                isActive ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white'
                            )}
                        >
                            <Icon size={24} />
                            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
