import React from 'react';
import { Music, Gamepad2, Zap, User } from 'lucide-react';
import { CategoryPill, TiltCard } from '../components/Common';

const MarketplaceView = ({ drops, filter, setFilter, theme, themeStyles, inventory, openDetail }) => {
    const filteredDrops = filter === 'All' ? drops : drops.filter(d => d.category === filter);

    return (
        <div className="px-4 pb-20 pt-6">
            <div className="mb-8 overflow-x-auto pb-4">
                <div className="flex gap-4">
                    {['All', 'Music', 'Games', 'Reels', 'Video'].map(cat => (
                        <CategoryPill
                            key={cat} theme={theme} label={cat}
                            icon={cat === 'Music' ? Music : cat === 'Games' ? Gamepad2 : Zap}
                            active={filter === cat} onClick={() => setFilter(cat)}
                        />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredDrops.map(drop => (
                    <TiltCard key={drop.id} theme={theme} onClick={() => openDetail(drop)} className="cursor-pointer">
                        <div className={`relative ${themeStyles.cardBg} border-4 ${themeStyles.border} ${themeStyles.shadow} transition-all h-full`}>
                            <div className={`aspect-square overflow-hidden border-b-4 ${themeStyles.border} relative`}>
                                <img src={drop.image} alt={drop.title} className="w-full h-full object-cover transition-transform duration-500 grayscale group-hover:grayscale-0" />
                                <div className={`absolute top-2 right-2 ${theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white'} px-2 py-1 font-mono text-xs font-bold`}>
                                    {drop.category}
                                </div>
                                {inventory.includes(drop.id) && (
                                    <div className="absolute top-2 left-2 bg-yellow-400 text-black border-2 border-black px-2 py-1 font-black text-xs">
                                        OWNED
                                    </div>
                                )}
                            </div>
                            <div className={`p-4 ${theme === 'night' ? 'bg-black text-green-400' : (drop.color || 'bg-white') + ' text-black'}`}>
                                <h3 className="text-xl font-black uppercase leading-tight mb-2 truncate">{drop.title}</h3>
                                <div className="flex justify-between items-end">
                                    <span className={`font-mono text-sm font-bold ${theme === 'night' ? 'bg-green-900 text-white border-green-500' : 'bg-white text-black border-black'} px-1 border`}>{drop.price}</span>
                                    <span className="text-xs font-bold uppercase flex items-center gap-1">
                                        <User size={12} /> {drop.holders} Owners
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TiltCard>
                ))}
            </div>
        </div>
    );
};

export default MarketplaceView;
