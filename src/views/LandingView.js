import React from 'react';
import { ArrowRight, Wallet, Zap, Lock, Activity } from 'lucide-react';
import { FunkyButton } from '../components/Common';

const LandingView = ({ theme, themeStyles, walletConnected, setView, connectWallet }) => (
    <div className="space-y-12 pb-20">
        <section className="relative pt-12 px-6 text-center">
            <h1 className={`text-6xl md:text-8xl font-black uppercase leading-[0.9] transform -rotate-2 ${theme === 'night' ? 'text-white' : 'text-black'}`}>
                Don't Buy <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === 'night' ? 'from-green-400 to-cyan-400' : 'from-pink-500 to-yellow-500'} stroke-black text-stroke-2`}>Art.</span> <br />
                Buy <span className={`underline decoration-wavy ${theme === 'night' ? 'decoration-green-500 text-green-400' : 'decoration-blue-500 text-black'}`}>Power.</span>
            </h1>
            <p className={`mt-8 text-xl font-bold font-mono max-w-2xl mx-auto border-l-4 ${themeStyles.border} pl-4 text-left ${themeStyles.text}`}>
                Stop collecting JPEGs. Start collecting <span className={`${themeStyles.accent} px-1 ${theme === 'night' ? 'text-white' : 'text-black'}`}>KEYS</span>. Unlock backstage passes, game items, and creator access.
            </p>

            <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
                <FunkyButton theme={theme} color={theme === 'night' ? 'bg-cyan-600' : 'bg-pink-500'} onClick={() => setView('market')}>
                    Explore The Drop
                    <ArrowRight size={20} />
                </FunkyButton>
                {!walletConnected && (
                    <FunkyButton theme={theme} color={themeStyles.cardBg} textColor={themeStyles.text} onClick={connectWallet}>
                        Connect Wallet
                        <Wallet size={20} />
                    </FunkyButton>
                )}
            </div>
        </section>

        <section className="px-4 grid md:grid-cols-3 gap-6">
            {[
                { icon: Zap, title: "Utility First", desc: "If it doesn't DO anything, it's not here.", color: theme === 'night' ? "bg-purple-900" : "bg-blue-300" },
                { icon: Lock, title: "Unlock Access", desc: "Your NFT is your login credential.", color: theme === 'night' ? "bg-green-900" : "bg-green-300" },
                { icon: Activity, title: "Level Up", desc: "Hold longer to earn more rewards.", color: theme === 'night' ? "bg-red-900" : "bg-red-300" }
            ].map((item, i) => (
                <div key={i} className={`p-6 border-4 ${themeStyles.border} ${themeStyles.shadow} ${item.color} ${theme === 'night' ? 'text-white' : 'text-black'}`}>
                    <div className={`${theme === 'night' ? 'bg-black border-green-500' : 'bg-black border-white'} text-white w-12 h-12 flex items-center justify-center rounded-full mb-4 border-2`}>
                        <item.icon />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2">{item.title}</h3>
                    <p className="font-mono font-bold">{item.desc}</p>
                </div>
            ))}
        </section>

        <div className="text-center mt-12 mb-8">
            <button onClick={() => setView('verifier')} className={`font-mono text-sm underline ${themeStyles.muted} hover:${themeStyles.text} hover:font-bold`}>
                Partner Login (Venue Verifier)
            </button>
        </div>
    </div>
);

export default LandingView;
