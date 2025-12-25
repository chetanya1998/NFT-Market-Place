import React, { useState } from 'react';
import { Plus, TrendingUp, Gift, Send, Users } from 'lucide-react';
import { FunkyButton } from '../components/Common';
import { ANALYTICS_DATA } from '../constants/data';

const CreatorView = ({ theme, themeStyles, drops, handleAirdrop, airdropStatus }) => {
    const [creatorTab, setCreatorTab] = useState('create');
    const [description, setDescription] = useState('');
    const [titleInput, setTitleInput] = useState('');

    return (
        <div className="px-4 py-8 max-w-4xl mx-auto pb-24">
            <h2 className={`text-4xl font-black uppercase mb-6 text-center ${themeStyles.text}`}>Creator Studio</h2>

            <div className="flex justify-center mb-8 gap-4 flex-wrap">
                {[
                    { id: 'create', label: 'Launchpad', icon: Plus },
                    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                    { id: 'airdrop', label: 'Airdrop Tool', icon: Gift }
                ].map(tab => (
                    <button key={tab.id} onClick={() => setCreatorTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-black uppercase border-4 ${themeStyles.border} transition-all
            ${creatorTab === tab.id
                                ? (theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white') + ' ' + themeStyles.shadow
                                : themeStyles.cardBg + ' ' + themeStyles.text + ' hover:opacity-80'}
          `}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {creatorTab === 'create' && (
                <div className={`${themeStyles.cardBg} ${themeStyles.text} border-4 ${themeStyles.border} p-6 ${themeStyles.shadow} space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300`}>
                    <div>
                        <label className="block font-black uppercase mb-2">Title</label>
                        <input
                            type="text"
                            placeholder="E.g. VIP Backstage Pass"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            className={`w-full ${themeStyles.inputBg} border-2 ${themeStyles.border} p-3 font-mono outline-none transition-colors ${themeStyles.text}`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-black uppercase mb-2">Supply</label>
                            <input type="number" placeholder="100" className={`w-full ${themeStyles.inputBg} border-2 ${themeStyles.border} p-3 font-mono outline-none ${themeStyles.text}`} />
                        </div>
                        <div>
                            <label className="block font-black uppercase mb-2">Price (ETH)</label>
                            <input type="text" placeholder="0.05" className={`w-full ${themeStyles.inputBg} border-2 ${themeStyles.border} p-3 font-mono outline-none ${themeStyles.text}`} />
                        </div>
                    </div>

                    <div>
                        <label className="block font-black uppercase mb-2">Utility Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Ticket', 'Content', 'Discord', 'Merch', 'Vote'].map(type => (
                                <button key={type} className={`border-2 ${themeStyles.border} p-2 ${theme === 'night' ? 'hover:bg-green-500 hover:text-black bg-gray-900' : 'hover:bg-black hover:text-white bg-white'} uppercase font-bold text-sm transition-colors`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block font-black uppercase mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your drop..."
                            className={`w-full h-24 ${themeStyles.inputBg} border-2 ${themeStyles.border} p-3 font-mono outline-none transition-colors ${themeStyles.text}`}
                        />
                    </div>

                    <div>
                        <label className="block font-black uppercase mb-2">Visual Asset</label>
                        <div className={`border-2 border-dashed ${themeStyles.border} h-32 flex items-center justify-center ${themeStyles.secondary} cursor-pointer`}>
                            <span className="font-mono text-sm">Drag Drop or Click</span>
                        </div>
                    </div>

                    <FunkyButton theme={theme} color="bg-red-500" className="w-full justify-center">
                        Deploy Contract
                    </FunkyButton>
                </div>
            )}

            {creatorTab === 'analytics' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className={`${theme === 'night' ? 'bg-orange-900 text-white' : 'bg-orange-300 text-black'} border-4 ${themeStyles.border} p-4 ${themeStyles.shadow}`}>
                            <h4 className="font-bold uppercase text-xs flex items-center gap-2 mb-2"><TrendingUp size={14} /> Total Revenue</h4>
                            <p className="text-4xl font-black">{ANALYTICS_DATA.totalRevenue}</p>
                            <p className="text-xs font-mono mt-1">+2.1 ETH this week</p>
                        </div>
                        <div className={`${theme === 'night' ? 'bg-blue-900 text-white' : 'bg-blue-300 text-black'} border-4 ${themeStyles.border} p-4 ${themeStyles.shadow}`}>
                            <h4 className="font-bold uppercase text-xs flex items-center gap-2 mb-2"><Activity size={14} /> Secondary Sales</h4>
                            <p className="text-4xl font-black">{ANALYTICS_DATA.secondarySales}</p>
                            <p className="text-xs font-mono mt-1">Royalties: 5%</p>
                        </div>
                        <div className={`${theme === 'night' ? 'bg-green-900 text-white' : 'bg-green-300 text-black'} border-4 ${themeStyles.border} p-4 ${themeStyles.shadow}`}>
                            <h4 className="font-bold uppercase text-xs flex items-center gap-2 mb-2"><Zap size={14} /> Active Redemptions</h4>
                            <p className="text-4xl font-black">{ANALYTICS_DATA.activeRedemptions}</p>
                            <p className="text-xs font-mono mt-1">Utility usage up 12%</p>
                        </div>
                    </div>

                    <div className={`${themeStyles.cardBg} ${themeStyles.text} border-4 ${themeStyles.border} p-6 ${themeStyles.shadow}`}>
                        <h3 className={`font-black uppercase text-xl mb-4 border-b-4 ${themeStyles.border} pb-2 flex items-center gap-2`}>
                            <Users /> Top Holders Leaderboard
                        </h3>
                        <div className="space-y-3">
                            {ANALYTICS_DATA.topHolders.map((holder, i) => (
                                <div key={i} className={`flex justify-between items-center p-3 border-2 ${themeStyles.border} ${themeStyles.secondary} transition-colors`}>
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-lg w-6">{i + 1}.</span>
                                        <div>
                                            <p className="font-bold uppercase">{holder.name}</p>
                                            <p className={`text-xs font-mono ${themeStyles.muted}`}>{holder.value} Contributed</p>
                                        </div>
                                    </div>
                                    <div className={`${theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white'} px-3 py-1 font-mono font-bold`}>
                                        {holder.held} Keys
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {creatorTab === 'airdrop' && (
                <div className={`${theme === 'night' ? 'bg-purple-900' : 'bg-purple-100'} border-4 ${themeStyles.border} p-6 ${themeStyles.shadow} animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden`}>
                    <div className="relative z-10">
                        <h3 className={`font-black uppercase text-2xl mb-2 flex items-center gap-2 ${theme === 'night' ? 'text-white' : 'text-black'}`}>
                            <Gift className="text-purple-500" /> Reward Your Fans
                        </h3>
                        <p className={`font-mono ${theme === 'night' ? 'text-purple-200' : 'text-gray-700'} mb-6 border-l-4 border-purple-500 pl-3`}>
                            Send free keys to your most loyal supporters directly.
                        </p>

                        <div className="space-y-4 max-w-lg">
                            <div>
                                <label className={`block font-black uppercase mb-2 text-sm ${theme === 'night' ? 'text-white' : 'text-black'}`}>Select Drop</label>
                                <select className={`w-full border-2 ${themeStyles.border} p-3 font-mono ${themeStyles.cardBg} ${themeStyles.text} outline-none`}>
                                    {drops.map(d => <option key={d.id}>{d.title}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={`block font-black uppercase mb-2 text-sm ${theme === 'night' ? 'text-white' : 'text-black'}`}>Recipient (Username or 0x...)</label>
                                <input type="text" placeholder="e.g. 0x8a7...99b" className={`w-full border-2 ${themeStyles.border} p-3 font-mono ${themeStyles.cardBg} ${themeStyles.text} outline-none`} />
                            </div>

                            <div>
                                <label className={`block font-black uppercase mb-2 text-sm ${theme === 'night' ? 'text-white' : 'text-black'}`}>Quantity</label>
                                <input type="number" defaultValue="1" className={`w-24 border-2 ${themeStyles.border} p-3 font-mono ${themeStyles.cardBg} ${themeStyles.text} outline-none`} />
                            </div>

                            <button onClick={handleAirdrop} disabled={airdropStatus !== 'idle'}
                                className={`w-full font-black uppercase py-4 border-4 ${themeStyles.border} transition-all flex items-center justify-center gap-2
                 ${airdropStatus === 'idle'
                                        ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none'
                                        : 'bg-gray-500 text-gray-300 cursor-wait'}
               `}
                            >
                                {airdropStatus === 'idle' && <>Send Airdrop <Send size={18} /></>}
                                {airdropStatus === 'sending' && "Processing..."}
                                {airdropStatus === 'success' && "Sent Successfully!"}
                            </button>
                        </div>
                    </div>
                    <Gift size={300} className="absolute -bottom-10 -right-10 text-purple-400 opacity-20 rotate-12 pointer-events-none" />
                </div>
            )}
        </div>
    );
};

export default CreatorView;
