import React from 'react';
import { Unlock, Scan } from 'lucide-react';
import { TiltCard, FunkyButton } from '../components/Common';

const ProfileView = ({ theme, themeStyles, userAddress, getLevel, xp, getProgress, inventory, drops, setView, openDetail }) => (
    <div className="px-4 py-8 max-w-4xl mx-auto pb-24">
        <div className={`bg-black text-white p-6 border-4 ${theme === 'night' ? 'border-green-500' : 'border-gray-800'} ${themeStyles.shadow} mb-8`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-yellow-500 border-4 border-white shadow-lg"></div>
                    <div>
                        <h2 className="text-2xl font-black uppercase">Cyberpunk_01</h2>
                        <p className="font-mono text-sm text-gray-400">{userAddress || "0x..."}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="bg-yellow-400 text-black px-2 text-xs font-black">LVL {getLevel()}</span>
                            <span className="text-xs font-mono text-gray-400">{xp} Total XP</span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-xs font-mono mb-1 text-gray-400">
                        <span>Progress to Lvl {getLevel() + 1}</span>
                        <span>{getProgress()}/100</span>
                    </div>
                    <div className="w-full bg-gray-800 h-4 border-2 border-white">
                        <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                            style={{ width: `${getProgress()}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div className={`flex justify-between items-center mb-6 ${themeStyles.text}`}>
            <h3 className={`text-3xl font-black uppercase italic transform -skew-x-12 inline-block ${themeStyles.accent} px-2 border-2 ${themeStyles.border} text-black`}>My Key Ring</h3>
            <button onClick={() => setView('verifier')} className="text-xs font-bold underline">Verifier Tool</button>
        </div>

        {inventory.length === 0 ? (
            <div className={`text-center py-12 border-4 border-dashed ${theme === 'night' ? 'border-green-800' : 'border-gray-400'}`}>
                <p className={`font-black text-xl mb-4 ${themeStyles.muted}`}>NO KEYS FOUND</p>
                <FunkyButton theme={theme} onClick={() => setView('market')}>Start Collecting</FunkyButton>
            </div>
        ) : (
            <div className="space-y-4">
                {inventory.map((dropId) => {
                    const drop = drops.find(d => d.id === dropId);
                    if (!drop) return null;
                    return (
                        <TiltCard key={dropId} theme={theme} className="">
                            <div className={`${themeStyles.cardBg} border-4 ${themeStyles.border} p-0 overflow-hidden ${themeStyles.shadow}`}>
                                <div className={`${theme === 'night' ? 'bg-green-600' : 'bg-green-400'} p-2 border-b-4 ${themeStyles.border} flex justify-between items-center text-black`}>
                                    <span className="font-black uppercase flex items-center gap-2"><Unlock size={18} /> Active Now</span>
                                    <span className="font-mono text-xs font-bold">Holder #{Math.floor(Math.random() * 1000)}</span>
                                </div>
                                <div className={`p-4 md:flex gap-6 items-center ${themeStyles.text}`}>
                                    <img src={drop.image} className={`w-20 h-20 object-cover border-2 ${themeStyles.border}`} alt={drop.title} />
                                    <div className="flex-grow">
                                        <h4 className="font-black text-xl">{drop.title}</h4>
                                        <p className={`font-mono text-sm mb-2 ${themeStyles.muted}`}>{drop.utilities[0].desc}</p>
                                        <div className={`inline-block ${themeStyles.secondary} p-2 border-2 border-dashed ${themeStyles.border} font-mono text-center tracking-widest font-bold`}>
                                            <Scan size={16} className="inline mr-2" />
                                            QR-{drop.id}-8892
                                        </div>
                                    </div>
                                    <button onClick={() => openDetail(drop)} className={`mt-4 md:mt-0 ${theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white'} px-4 py-2 font-bold uppercase hover:opacity-80`}>
                                        Access Hub
                                    </button>
                                </div>
                            </div>
                        </TiltCard>
                    );
                })}
            </div>
        )}
    </div>
);

export default ProfileView;
