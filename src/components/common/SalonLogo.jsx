import { Scissors } from 'lucide-react';

export default function SalonLogo({ size = 'md', lightText = false }) {
    const dimensions = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';

    return (
        <div className="flex items-center gap-3 select-none group cursor-pointer">
            <div className={`${dimensions} rounded-full bg-gradient-to-br from-[#F23030] to-[#991b1b] flex items-center justify-center shadow-lg shadow-[#F23030]/25 border border-[#F28888]/40 transition-transform duration-300 group-hover:scale-105`}>
                <Scissors className="w-5 h-5 text-white -rotate-45" />
            </div>
            <div className="flex flex-col">
                <span className={`font-serif font-bold tracking-wide leading-tight ${size === 'lg' ? 'text-2xl' : 'text-lg sm:text-xl'} ${lightText ? 'text-white' : 'text-[#F23030]'}`}>
                    Rosy Cabeleireira
                </span>
                <span className={`text-[10px] uppercase tracking-[0.22em] font-sans font-semibold ${lightText ? 'text-[#f2e5dc]/80' : 'text-zinc-400'}`}>
                    Salão de Beleza
                </span>
            </div>
        </div>
    );
}
