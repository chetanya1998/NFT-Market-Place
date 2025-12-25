import React, { useState } from 'react';
import { ArrowRight, X, CheckCircle, Lock, Unlock, Ticket, BarChart2, Zap, Send, Play } from 'lucide-react';
import { FunkyButton } from '../components/Common';

const DetailView = ({ selectedDrop, inventory, theme, themeStyles, setView, chatMessages, handleChatSubmit, handleVote, handleMint }) => {
    if (!selectedDrop) return null;
    const isOwned = inventory.includes(selectedDrop.id);
    const [activeTab, setActiveTab] = useState('utility');
    const [chatInput, setChatInput] = useState('');

    // Filter chats for this drop
    const dropChats = chatMessages.filter(m => m.dropId === selectedDrop.id);

    return (
        <div className={`fixed inset-0 z-50 overflow-y-auto ${theme === 'night' ? 'bg-black' : 'bg-yellow-50'}`}>
            <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setView('market')} className={`flex items-center gap-2 font-black uppercase hover:underline ${themeStyles.text}`}>
                        <ArrowRight className="rotate-180" /> Back to Market
                    </button>
                    <button onClick={() => setView('market')} className={`p-2 border-2 ${themeStyles.border} ${themeStyles.cardBg} ${themeStyles.text} hover:opacity-80 transition-colors`}>
                        <X />
                    </button>
                </div>

                <div className={`grid md:grid-cols-2 gap-8 ${themeStyles.cardBg} border-4 ${themeStyles.border} p-4 md:p-8 ${themeStyles.shadow}`}>
                    <div>
                        <div className={`aspect-square border-4 ${themeStyles.border} mb-4 overflow-hidden relative group`}>
                            <img src={selectedDrop.image} className={`w-full h-full object-cover ${!isOwned ? 'grayscale' : ''}`} />
                            {!isOwned && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="bg-black text-white px-4 py-2 font-black transform -rotate-6 text-xl border-2 border-white">
                                        LOCKED
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`flex justify-between font-mono border-2 ${themeStyles.border} p-2 ${themeStyles.secondary} ${themeStyles.text}`}>
                            <span>Creator</span>
                            <span className="font-bold">{selectedDrop.creator}</span>
                        </div>

                        {isOwned ? (
                            <div className={`mt-4 ${theme === 'night' ? 'bg-green-900 border-green-500 text-green-200' : 'bg-green-100 border-green-600 text-green-800'} border-4 p-4 text-center`}>
                                <h3 className="font-black text-xl flex items-center justify-center gap-2">
                                    <CheckCircle /> ACCESS GRANTED
                                </h3>
                                <p className="font-mono text-sm mt-1">You hold the Key.</p>
                            </div>
                        ) : (
                            <div className={`mt-4 ${theme === 'night' ? 'bg-red-900 border-red-500 text-red-200' : 'bg-red-100 border-red-500 text-red-800'} border-4 p-4 text-center`}>
                                <h3 className="font-black text-xl flex items-center justify-center gap-2">
                                    <Lock size={18} /> ACCESS DENIED
                                </h3>
                                <p className="font-mono text-sm mt-1">Mint to unlock secret content & chat.</p>
                            </div>
                        )}
                    </div>

                    <div className={`flex flex-col h-full ${themeStyles.text}`}>
                        <h1 className="text-4xl md:text-5xl font-black uppercase mb-2 leading-[0.9]">{selectedDrop.title}</h1>
                        <p className={`font-mono mb-6 ${themeStyles.muted}`}>Holders: {selectedDrop.holders}</p>

                        <div className={`flex gap-2 mb-4 border-b-4 ${themeStyles.border} pb-4 overflow-x-auto`}>
                            {['utility', 'community', 'vote'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 font-black uppercase border-2 ${themeStyles.border} transition-all whitespace-nowrap
                  ${activeTab === tab
                                            ? (theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white translate-y-[2px]')
                                            : (theme === 'night' ? 'bg-transparent text-green-400 hover:bg-green-900' : 'bg-white hover:bg-gray-200')}
                `}
                                >
                                    {tab === 'utility' ? 'Power-Ups' : tab === 'community' ? 'Chat' : 'Governance'}
                                </button>
                            ))}
                        </div>

                        <div className="flex-grow overflow-y-auto max-h-[400px]">
                            {activeTab === 'utility' && (
                                <div className="space-y-4">
                                    {isOwned && selectedDrop.secretContent && (
                                        <div className={`border-4 ${theme === 'night' ? 'border-cyan-500 bg-cyan-900/30' : 'border-blue-500 bg-blue-50'} p-4 animate-pulse-slow`}>
                                            <h4 className={`font-black uppercase ${theme === 'night' ? 'text-cyan-400' : 'text-blue-800'} mb-2 flex items-center gap-2`}>
                                                <Unlock size={16} /> Exclusive Content
                                            </h4>
                                            <div className={`${themeStyles.cardBg} border-2 ${themeStyles.border} p-3 flex justify-between items-center`}>
                                                <span className="font-bold font-mono text-sm">{selectedDrop.secretContent.label}</span>
                                                <button className={`${theme === 'night' ? 'bg-cyan-600' : 'bg-blue-600'} text-white p-2 hover:opacity-80`}>
                                                    <Play size={16} fill="white" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {selectedDrop.utilities.map((util, i) => (
                                        <div key={i} className={`flex items-start gap-4 p-4 border-2 ${themeStyles.border} ${themeStyles.secondary}`}>
                                            <div className={`p-2 border-2 ${themeStyles.border} ${isOwned ? (theme === 'night' ? 'bg-green-500 text-black' : 'bg-green-400 text-black') : (theme === 'night' ? 'bg-black text-white' : 'bg-black text-white')}`}>
                                                {util.type === 'access' ? <Ticket size={20} /> : util.type === 'vote' ? <BarChart2 size={20} /> : <Zap size={20} />}
                                            </div>
                                            <div>
                                                <span className={`block text-xs font-bold uppercase ${themeStyles.muted}`}>{util.type}</span>
                                                <span className="font-bold text-lg leading-tight">{util.desc}</span>
                                                {isOwned && util.type === 'access' && (
                                                    <span className={`block text-xs font-mono ${theme === 'night' ? 'bg-green-900 text-green-300' : 'bg-black text-white'} inline-block px-1 mt-1`}>CODE: 8X-99</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'community' && (
                                <div className="h-full flex flex-col">
                                    {!isOwned ? (
                                        <div className={`flex-grow flex flex-col items-center justify-center text-center p-8 opacity-50 ${themeStyles.secondary} border-2 border-dashed ${themeStyles.border}`}>
                                            <Lock size={48} className="mb-4" />
                                            <p className="font-black uppercase">Holders Only</p>
                                            <p className="font-mono text-sm">Mint this Key to join the chat.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-grow space-y-3 mb-4 pr-2">
                                                {dropChats.length === 0 && <p className={`text-sm font-mono ${themeStyles.muted}`}>No messages yet. Be the first!</p>}
                                                {dropChats.map((msg, i) => (
                                                    <div key={i} className={`${themeStyles.cardBg} border-2 ${themeStyles.border} p-2`}>
                                                        <span className={`font-black text-xs block ${theme === 'night' ? 'text-pink-400' : 'text-pink-600'}`}>{msg.user}</span>
                                                        <span className="font-mono text-sm">{msg.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    placeholder="Say something..."
                                                    className={`flex-grow border-2 ${themeStyles.border} p-2 font-mono text-sm outline-none ${themeStyles.inputBg} ${themeStyles.text}`}
                                                />
                                                <button
                                                    onClick={() => {
                                                        if (chatInput) {
                                                            handleChatSubmit(selectedDrop.id, chatInput);
                                                            setChatInput('');
                                                        }
                                                    }}
                                                    className={`bg-black text-white p-2 border-2 ${themeStyles.border} hover:opacity-80`}
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {activeTab === 'vote' && (
                                <div className="space-y-4">
                                    {!isOwned ? (
                                        <div className={`p-4 ${themeStyles.secondary} border-2 ${themeStyles.border} text-center`}>
                                            <p className={`font-mono font-bold ${themeStyles.muted}`}>Must hold key to vote.</p>
                                        </div>
                                    ) : selectedDrop.poll ? (
                                        <div className={`${theme === 'night' ? 'bg-yellow-900/40' : 'bg-yellow-100'} border-4 ${themeStyles.border} p-4`}>
                                            <h4 className="font-black uppercase mb-4 text-xl">{selectedDrop.poll.question}</h4>
                                            {selectedDrop.poll.options.map((opt, i) => (
                                                <div key={i} className="mb-2">
                                                    <button
                                                        onClick={() => !selectedDrop.poll.voted && handleVote(selectedDrop.id, i)}
                                                        disabled={selectedDrop.poll.voted}
                                                        className={`w-full flex justify-between items-center p-3 border-2 ${themeStyles.border} font-mono font-bold transition-all
                               ${selectedDrop.poll.voted
                                                                ? `${themeStyles.secondary} opacity-70`
                                                                : `${themeStyles.cardBg} ${theme === 'night' ? 'hover:bg-green-900' : 'hover:bg-yellow-300'} hover:translate-x-1`}
                             `}
                                                    >
                                                        <span>{opt.label}</span>
                                                        <span>{opt.votes} Votes</span>
                                                    </button>
                                                </div>
                                            ))}
                                            {selectedDrop.poll.voted && <p className="text-center font-black uppercase text-green-600 mt-2">Voted Submitted</p>}
                                        </div>
                                    ) : (
                                        <p className="font-mono italic text-center">No active polls.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {!isOwned && (
                            <div className={`mt-6 border-t-4 ${themeStyles.border} pt-6`}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-black text-2xl">{selectedDrop.price}</span>
                                    <span className={`text-sm font-mono ${theme === 'night' ? 'bg-green-900 text-green-300' : 'bg-green-200 text-green-800'} px-2 border ${themeStyles.border}`}>12 Remaining</span>
                                </div>
                                <FunkyButton theme={theme} color={themeStyles.accent} textColor="text-black" className="w-full" onClick={() => handleMint(selectedDrop.id)}>
                                    GRAB KEY NOW (+100 XP)
                                </FunkyButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailView;
