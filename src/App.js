import React, { useState, useEffect } from 'react';
import { Moon, Sun, Zap, Unlock, Plus, User } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, setDoc, onSnapshot, updateDoc,
    addDoc, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import {
    getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken
} from 'firebase/auth';

// Constants & Data
import { THEMES, INITIAL_DROPS } from './constants/data';

// Components
import { Marquee, XPToast } from './components/Common';

// Views
import LandingView from './views/LandingView';
import MarketplaceView from './views/MarketplaceView';
import DetailView from './views/DetailView';
import ProfileView from './views/ProfileView';
import VerifierView from './views/VerifierView';
import CreatorView from './views/CreatorView';

// Styles
import './styles/index.css';

// --- FIREBASE SETUP ---
// Note: __firebase_config and __app_id are expected to be available globally in the prototype environment
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'unlock-protocol-default';

export default function App() {
    const [view, setView] = useState('landing');
    const [drops, setDrops] = useState(INITIAL_DROPS);
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [userAddress, setUserAddress] = useState('');
    const [filter, setFilter] = useState('All');
    const [inventory, setInventory] = useState([]);
    const [theme, setTheme] = useState('day'); // 'day' | 'night'
    const [user, setUser] = useState(null);

    // Gamification State
    const [xp, setXp] = useState(0);
    const [showXPToast, setShowXPToast] = useState({ visible: false, amount: 0 });
    const [showConfetti, setShowConfetti] = useState(false);

    // Verifier State
    const [verifyCode, setVerifyCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState('idle');

    // Chat State
    const [chatMessages, setChatMessages] = useState([]);

    const themeStyles = THEMES[theme];

    // --- FIREBASE AUTH & SYNC ---
    useEffect(() => {
        const initAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        };
        initAuth();
        const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsubscribe();
    }, []);

    // Listen for User Profile Updates
    useEffect(() => {
        if (!user) return;
        const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main');
        const unsub = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setXp(data.xp || 0);
                setInventory(data.inventory || []);
            } else {
                setDoc(userRef, { xp: 0, inventory: [] });
            }
        }, (err) => console.log("Profile Sync Error", err));
        return () => unsub();
    }, [user]);

    // Listen for Chat Messages
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, 'artifacts', appId, 'public', 'data', 'chat_messages'),
            orderBy('timestamp', 'asc')
        );
        const unsub = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChatMessages(msgs);
        }, (err) => console.log("Chat Sync Error", err));
        return () => unsub();
    }, [user]);

    // --- ACTIONS ---
    const gainXP = async (amount) => {
        if (!user) return;
        const newXP = xp + amount;
        setShowXPToast({ visible: true, amount });
        const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main');
        await updateDoc(userRef, { xp: newXP });
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setUserAddress(accounts[0]);
                setWalletConnected(true);
                setView('profile');
                gainXP(50);
            } catch (error) {
                console.error("Wallet connection failed", error);
            }
        } else {
            setUserAddress("0xDemo...Wallet");
            setWalletConnected(true);
            setView('profile');
            console.warn("No wallet detected, using demo mode.");
        }
    };

    const handleMint = async (dropId) => {
        if (!user) return;
        const newInventory = [...inventory, dropId];
        setInventory(newInventory);
        gainXP(100);
        setShowConfetti(true);

        const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main');
        await updateDoc(userRef, { inventory: newInventory });

        setTimeout(() => {
            setShowConfetti(false);
            setView('profile');
        }, 2000);
    };

    const handleChatSubmit = async (dropId, text) => {
        if (!user || !text.trim()) return;
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'chat_messages'), {
            text,
            user: userAddress.substring(0, 6) + "...",
            dropId,
            timestamp: serverTimestamp()
        });
    };

    const handleVote = (dropId, optionIndex) => {
        const newDrops = drops.map(d => {
            if (d.id === dropId && d.poll) {
                const newOptions = [...d.poll.options];
                newOptions[optionIndex].votes += 1;
                return { ...d, poll: { ...d.poll, options: newOptions, voted: true } };
            }
            return d;
        });
        setDrops(newDrops);
        setSelectedDrop(newDrops.find(d => d.id === dropId));
        gainXP(20);
    };

    const toggleTheme = () => setTheme(prev => prev === 'day' ? 'night' : 'day');

    useEffect(() => {
        if (showXPToast.visible) {
            const timer = setTimeout(() => setShowXPToast({ ...showXPToast, visible: false }), 3000);
            return () => clearTimeout(timer);
        }
    }, [showXPToast]);

    const getLevel = () => Math.floor(xp / 100) + 1;
    const getProgress = () => xp % 100;

    const openDetail = (drop) => {
        setSelectedDrop(drop);
        setView('detail');
    };

    const handleVerify = () => {
        setVerifyStatus('scanning');
        setTimeout(() => {
            if (verifyCode.includes("QR")) {
                setVerifyStatus('success');
                gainXP(50);
            } else {
                setVerifyStatus('error');
            }
        }, 1500);
    };

    return (
        <div className={`min-h-screen ${themeStyles.bg} font-sans ${themeStyles.text} overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-300`}
            style={{ '--stroke-color': theme === 'night' ? 'white' : 'black' }}>
            <XPToast amount={showXPToast.amount} visible={showXPToast.visible} theme={theme} />

            {showConfetti && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                    <div className={`animate-bounce text-6xl font-black ${themeStyles.cardBg} border-4 ${themeStyles.border} p-8 ${themeStyles.shadow}`}>
                        {view === 'mint' ? 'AIRDROP SENT!' : 'KEY SECURED!'} <br />
                        <span className={`text-sm font-mono font-normal ${themeStyles.muted}`}>
                            {view === 'mint' ? 'Fan rewarded.' : 'Check your profile...'}
                        </span>
                    </div>
                </div>
            )}

            {view !== 'verifier' && (
                <nav className={`sticky top-0 z-40 ${themeStyles.navBg} border-b-4 ${themeStyles.border} px-4 py-3 flex justify-between items-center transition-colors duration-300`}>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
                        <div className={`w-8 h-8 ${theme === 'night' ? 'bg-green-500' : 'bg-black'}`}></div>
                        <span className="text-2xl font-black tracking-tighter">UNLOCK</span>
                    </div>

                    <div className="hidden md:flex gap-6 font-bold uppercase text-sm items-center">
                        <button onClick={() => setView('market')} className="hover:underline decoration-wavy decoration-pink-500 underline-offset-4">Market</button>
                        <button onClick={() => setView('mint')} className="hover:underline decoration-wavy decoration-green-500 underline-offset-4">Creator Studio</button>
                        <button onClick={toggleTheme} className={`p-2 border-2 ${themeStyles.border} rounded-full hover:rotate-12 transition-transform`}>
                            {theme === 'day' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {walletConnected ? (
                            <button onClick={() => setView('profile')} className={`flex items-center gap-2 ${theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white'} px-3 py-1 font-mono text-sm border-2 border-transparent hover:opacity-80 transition-colors`}>
                                <div className={`w-2 h-2 ${theme === 'night' ? 'bg-black' : 'bg-green-400'} rounded-full animate-pulse`}></div>
                                {userAddress ? userAddress.substring(0, 6) + '...' + userAddress.slice(-4) : "0x..."}
                            </button>
                        ) : (
                            <button onClick={connectWallet} className={`bg-blue-600 text-white px-4 py-1 font-bold uppercase border-2 ${themeStyles.border} hover:bg-blue-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}>
                                Connect
                            </button>
                        )}
                    </div>
                </nav>
            )}

            <main className={view !== 'verifier' ? "min-h-[80vh]" : ""}>
                {view === 'landing' && <LandingView theme={theme} themeStyles={themeStyles} walletConnected={walletConnected} setView={setView} connectWallet={connectWallet} />}
                {view === 'market' && <MarketplaceView drops={drops} filter={filter} setFilter={setFilter} theme={theme} themeStyles={themeStyles} inventory={inventory} openDetail={openDetail} />}
                {view === 'detail' && <DetailView selectedDrop={selectedDrop} inventory={inventory} theme={theme} themeStyles={themeStyles} setView={setView} chatMessages={chatMessages} handleChatSubmit={handleChatSubmit} handleVote={handleVote} handleMint={handleMint} />}
                {view === 'profile' && <ProfileView theme={theme} themeStyles={themeStyles} userAddress={userAddress} getLevel={getLevel} xp={xp} getProgress={getProgress} inventory={inventory} drops={drops} setView={setView} openDetail={openDetail} />}
                {view === 'mint' && <CreatorView theme={theme} themeStyles={themeStyles} drops={drops} handleAirdrop={() => { }} airdropStatus="idle" />}
                {view === 'verifier' && <VerifierView setView={setView} verifyStatus={verifyStatus} handleVerify={handleVerify} verifyCode={verifyCode} setVerifyCode={setVerifyCode} />}
            </main>

            {view !== 'verifier' && (
                <footer className={`border-t-4 ${themeStyles.border} ${themeStyles.cardBg} pb-8 md:pb-0`}>
                    <Marquee theme={theme} text="BUILT FOR THE CREATOR ECONOMY • OWN YOUR ACCESS • UNLOCK PROTOCOL 2024 •" />
                    <div className="p-8 text-center md:flex justify-between items-center">
                        <p className={`font-mono text-xs font-bold ${themeStyles.muted}`}>© 2024 UNLOCK PROTOCOL. NO RIGHTS RESERVED.</p>
                        <div className="flex justify-center gap-4 mt-4 md:mt-0">
                            <div className={`w-8 h-8 ${theme === 'night' ? 'bg-green-500' : 'bg-black'} hover:bg-pink-500 transition-colors`}></div>
                            <div className={`w-8 h-8 ${theme === 'night' ? 'bg-green-500' : 'bg-black'} hover:bg-blue-500 transition-colors`}></div>
                            <div className={`w-8 h-8 ${theme === 'night' ? 'bg-green-500' : 'bg-black'} hover:bg-yellow-500 transition-colors`}></div>
                        </div>
                    </div>
                </footer>
            )}

            <div className={`md:hidden fixed bottom-0 left-0 right-0 ${themeStyles.cardBg} border-t-4 ${themeStyles.border} flex justify-around p-3 z-40`}>
                <button onClick={() => setView('landing')} className={`flex flex-col items-center ${view === 'landing' ? 'text-pink-600' : themeStyles.muted}`}><Zap size={20} /></button>
                <button onClick={() => setView('market')} className={`flex flex-col items-center ${view === 'market' ? 'text-blue-600' : themeStyles.muted}`}><Unlock size={20} /></button>
                <button onClick={() => setView('mint')} className={`flex flex-col items-center ${view === 'mint' ? 'text-green-600' : themeStyles.muted}`}><Plus size={20} /></button>
                <button onClick={() => setView('profile')} className={`flex flex-col items-center ${view === 'profile' ? 'text-yellow-600' : themeStyles.muted}`}><User size={20} /></button>
            </div>
        </div>
    );
}
