import React, { useState, useEffect, useRef } from 'react';
import {
    Zap, Music, Gamepad2, Video, Wallet, User, Plus, ArrowRight, Lock,
    Unlock, Ticket, Star, Activity, X, MessageCircle, Play, CheckCircle,
    Scan, BarChart2, Send, ShieldCheck, Gift, TrendingUp, Users, PieChart,
    Moon, Sun, Loader, Sparkles
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, setDoc, onSnapshot, updateDoc,
    addDoc, query, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore';
import {
    getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken
} from 'firebase/auth';

// --- FIREBASE SETUP ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'unlock-protocol-default';

// --- GEMINI API SETUP ---
const apiKey = "";

// --- THEME CONFIGURATION ---
const THEMES = {
    day: {
        bg: "bg-[#f3f3f3]",
        text: "text-black",
        border: "border-black",
        cardBg: "bg-white",
        accent: "bg-yellow-400",
        secondary: "bg-gray-100",
        highlight: "bg-pink-500",
        muted: "text-gray-500",
        shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
        shadowHover: "hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]",
        inputBg: "bg-gray-100",
        navBg: "bg-white"
    },
    night: {
        bg: "bg-black",
        text: "text-green-400",
        border: "border-green-500",
        cardBg: "bg-gray-900",
        accent: "bg-cyan-600",
        secondary: "bg-gray-800",
        highlight: "bg-purple-600",
        muted: "text-gray-500",
        shadow: "shadow-[0px_0px_10px_2px_rgba(74,222,128,0.5)]",
        shadowHover: "hover:shadow-[0px_0px_20px_5px_rgba(74,222,128,0.8)]",
        inputBg: "bg-gray-800",
        navBg: "bg-black"
    }
};

// --- STATIC DATA (Simulating Smart Contract Data) ---
const INITIAL_DROPS = [
    {
        id: 1,
        title: "Midnight Raves Vol. 1",
        creator: "DJ K-OS",
        category: "Music",
        price: "0.05 ETH",
        image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=600",
        utilities: [
            { type: "access", desc: "Backstage Pass for Oct Tour", status: "ready" },
            { type: "reward", desc: "Early Access to 'Nightfall' track", status: "locked" }
        ],
        holders: 1204,
        color: "bg-green-400",
        secretContent: {
            type: "audio",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            label: "Exclusive Stream: Nightfall (Demo)"
        },
        poll: {
            question: "Which city should I tour next?",
            options: [
                { label: "Tokyo", votes: 45 },
                { label: "Berlin", votes: 32 },
                { label: "New York", votes: 12 }
            ]
        }
    },
    {
        id: 2,
        title: "Glitch Samurai Skin",
        creator: "PixelForge",
        category: "Games",
        price: "0.02 ETH",
        image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600",
        utilities: [
            { type: "game item", desc: "Equip in 'Neon City' MMO", status: "ready" },
            { type: "community", desc: "Dev Chat Access", status: "ready" }
        ],
        holders: 890,
        color: "bg-pink-400",
        secretContent: {
            type: "code",
            code: "STEAM-KEY-8822-X99",
            label: "Redeem on Steam"
        },
        poll: null
    },
    {
        id: 3,
        title: "Creator Circle Gen 0",
        creator: "Sarah Snaps",
        category: "Reels",
        price: "0.08 ETH",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600",
        utilities: [
            { type: "vote", desc: "Vote on next video topic", status: "ready" },
            { type: "collab", desc: "1-on-1 Mentorship Call", status: "claimed" }
        ],
        holders: 50,
        color: "bg-yellow-400",
        secretContent: null,
        poll: {
            question: "Next video topic?",
            options: [
                { label: "How to edit fast", votes: 120 },
                { label: "My camera gear", votes: 45 }
            ]
        }
    },
    {
        id: 4,
        title: "Underground Cinema",
        creator: "Indie Films",
        category: "Video",
        price: "0.03 ETH",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600",
        utilities: [
            { type: "ticket", desc: "Free Entry to NY Pop-up", status: "ready" },
            { type: "content", desc: "Director's Cut Stream", status: "locked" }
        ],
        holders: 300,
        color: "bg-blue-400",
        secretContent: {
            type: "video",
            label: "Watch Director's Cut"
        },
        poll: null
    }
];

const ANALYTICS_DATA = {
    totalRevenue: "14.2 ETH",
    secondarySales: "4.5 ETH",
    activeRedemptions: 842,
    topHolders: [
        { name: "0xMoon...Walk", held: 12, value: "0.6 ETH" },
        { name: "Cyber_Punk", held: 8, value: "0.4 ETH" },
        { name: "Alice_WAGMI", held: 5, value: "0.25 ETH" },
        { name: "RareCollector", held: 4, value: "0.2 ETH" }
    ]
};

// --- COMPONENTS ---

const TiltCard = ({ children, onClick, className, theme }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        setRotation({ x: rotateX, y: rotateY });
    };

    return (
        <div
            className={`perspective-1000 ${className}`}
            onClick={onClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { setIsHovering(false); setRotation({ x: 0, y: 0 }); }}
        >
            <div
                className={`transition-transform duration-100 ease-out preserve-3d h-full w-full`}
                style={{
                    transform: isHovering ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)` : 'rotateX(0deg) rotateY(0deg) scale(1)',
                    transformStyle: 'preserve-3d'
                }}
            >
                {children}
                {isHovering && (
                    <div
                        className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-tr from-transparent via-white to-transparent"
                        style={{ transform: `translateX(${rotation.y * 2}px) translateY(${rotation.x * 2}px)` }}
                    />
                )}
            </div>
        </div>
    );
};

const FunkyButton = ({ children, onClick, theme, color, textColor, className = "", disabled = false }) => {
    const styles = THEMES[theme];
    const btnColor = color || (theme === 'night' ? 'bg-green-500' : 'bg-black');

    let btnText = textColor;
    if (!btnText) {
        if (theme === 'night') {
            btnText = 'text-black';
        } else {
            if (['white', 'yellow', 'cyan', 'pink', 'green', 'orange', 'gray-100'].some(c => btnColor.includes(c))) {
                btnText = 'text-black';
            } else {
                btnText = 'text-white';
            }
        }
    }

    const baseShadow = theme === 'night' ? 'shadow-[4px_4px_0px_0px_rgba(74,222,128,0.5)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
    const hoverShadow = theme === 'night' ? 'hover:shadow-[6px_6px_0px_0px_rgba(74,222,128,0.7)]' : 'hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]';
    const activeShadow = 'active:shadow-none active:translate-x-[4px] active:translate-y-[4px]';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`font-black uppercase tracking-wider px-6 py-3 border-4 ${styles.border} ${btnColor} ${btnText} transition-all 
        ${disabled ? 'opacity-50 cursor-not-allowed' : `${baseShadow} ${hoverShadow} ${activeShadow} hover:-translate-y-1 hover:-translate-x-1`} 
        ${className}`}
        >
            <span className="flex items-center justify-center gap-2">{children}</span>
        </button>
    );
};

const Marquee = ({ text, theme }) => {
    const styles = THEMES[theme];
    return (
        <div className={`${theme === 'night' ? 'bg-green-900 border-green-500' : 'bg-black border-black'} ${styles.text} py-3 overflow-hidden border-y-4 whitespace-nowrap`}>
            <div className="animate-marquee inline-block font-mono font-bold text-lg text-white">
                {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp;
            </div>
        </div>
    );
};

const CategoryPill = ({ icon: Icon, label, active, onClick, theme }) => {
    const styles = THEMES[theme];
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 border-2 ${styles.border} font-bold uppercase text-sm transition-all
        ${active
                    ? (theme === 'night' ? 'bg-green-500 text-black' : 'bg-black text-white') + ' ' + styles.shadow
                    : styles.cardBg + ' ' + styles.text + ' hover:opacity-80'}
      `}
        >
            <Icon size={16} />
            {label}
        </button>
    );
};

const XPToast = ({ amount, visible, theme }) => {
    const styles = THEMES[theme];
    return (
        <div className={`fixed top-24 right-4 z-[60] transform transition-all duration-500 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className={`${styles.accent} ${styles.text === 'text-black' ? 'text-black' : 'text-white'} border-4 ${styles.border} p-4 ${styles.shadow} flex items-center gap-3`}>
                <Star className="fill-current animate-spin-slow" size={32} />
                <div>
                    <h4 className="font-black text-xl italic">LEVEL UP!</h4>
                    <p className="font-mono font-bold">+{amount} XP Gained</p>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
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

    // AI State
    const [aiLoading, setAiLoading] = useState(false);

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

    // Listen for User Profile Updates (XP, Inventory)
    useEffect(() => {
        if (!user) return;
        const userRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main');
        const unsub = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setXp(data.xp || 0);
                setInventory(data.inventory || []);
            } else {
                // Initialize if new user
                setDoc(userRef, { xp: 0, inventory: [] });
            }
        }, (err) => console.log("Profile Sync Error", err));
        return () => unsub();
    }, [user]);

    // Listen for Chat Messages (Global for prototype simplicity, filtered in UI)
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
                // Bonus XP for connecting
                gainXP(50);
            } catch (error) {
                console.error("Wallet connection failed", error);
            }
        } else {
            // Fallback for demo environment if no wallet extension
            setUserAddress("0xDemo...Wallet");
            setWalletConnected(true);
            setView('profile');
            console.warn("No wallet detected, using demo mode.");
        }
    };

    const handleMint = async (dropId) => {
        if (!user) return;
        const newInventory = [...inventory, dropId];
        // Optimistic UI update
        setInventory(newInventory);
        gainXP(100);
        setShowConfetti(true);

        // Persist
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
        // For prototype, we update local state. In production, this would write to Firestore 'polls' collection
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

    const callGemini = async (prompt) => {
        setAiLoading(true);
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );
            const data = await response.json();
            setAiLoading(false);
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI currently napping. Try again.";
        } catch (error) {
            console.error("Gemini Error:", error);
            setAiLoading(false);
            return "Connection lost to the AI matrix.";
        }
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

    // --- VIEWS ---

    const LandingView = () => (
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

    const MarketplaceView = () => {
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
                                <div className={`p-4 ${theme === 'night' ? 'bg-black text-green-400' : drop.color + ' text-black'}`}>
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

    const DetailView = () => {
        if (!selectedDrop) return null;
        const isOwned = inventory.includes(selectedDrop.id);
        const [activeTab, setActiveTab] = useState('utility');
        const [chatInput, setChatInput] = useState('');
        const [vibeCheck, setVibeCheck] = useState('');

        // Filter chats for this drop
        const dropChats = chatMessages.filter(m => m.dropId === selectedDrop.id);

        const handleVibeCheck = async () => {
            setVibeCheck('');
            const prompt = `Analyze this NFT drop for a Gen Z audience. Be funky, use slang (WAGMI, dope, fire), and be brief (under 50 words). 
      Title: ${selectedDrop.title}
      Category: ${selectedDrop.category}
      Price: ${selectedDrop.price}
      Utilities: ${selectedDrop.utilities.map(u => u.desc).join(', ')}`;

            const result = await callGemini(prompt);
            setVibeCheck(result);
        };

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
                                        {/* GEMINI VIBE CHECK */}
                                        <div className={`border-4 ${theme === 'night' ? 'border-pink-500 bg-pink-900/20' : 'border-pink-500 bg-pink-50'} p-4`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className={`font-black uppercase ${theme === 'night' ? 'text-pink-400' : 'text-pink-600'} flex items-center gap-2`}>
                                                    <Sparkles size={18} /> AI Vibe Check
                                                </h4>
                                                <button onClick={handleVibeCheck} disabled={aiLoading} className="text-xs font-bold underline hover:no-underline">
                                                    {aiLoading ? 'Analyzing...' : '✨ Run Check'}
                                                </button>
                                            </div>
                                            {vibeCheck ? (
                                                <p className={`font-mono text-sm ${theme === 'night' ? 'text-pink-200' : 'text-pink-800'}`}>{vibeCheck}</p>
                                            ) : (
                                                <p className={`font-mono text-xs ${themeStyles.muted}`}>Click run to see if this drop is WAGMI.</p>
                                            )}
                                        </div>

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
                                    <FunkyButton theme={theme} color={themeStyles.accent} textColor={theme === 'day' ? 'text-black' : 'text-black'} className="w-full" onClick={() => handleMint(selectedDrop.id)}>
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

    const ProfileView = () => (
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
                <h3 className={`text-3xl font-black uppercase italic transform -skew-x-12 inline-block ${themeStyles.accent} px-2 border-2 ${themeStyles.border} ${theme === 'night' ? 'text-black' : 'text-black'}`}>My Key Ring</h3>
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
                        return (
                            <TiltCard key={dropId} theme={theme} className="">
                                <div className={`${themeStyles.cardBg} border-4 ${themeStyles.border} p-0 overflow-hidden ${themeStyles.shadow}`}>
                                    <div className={`${theme === 'night' ? 'bg-green-600' : 'bg-green-400'} p-2 border-b-4 ${themeStyles.border} flex justify-between items-center text-black`}>
                                        <span className="font-black uppercase flex items-center gap-2"><Unlock size={18} /> Active Now</span>
                                        <span className="font-mono text-xs font-bold">Holder #{Math.floor(Math.random() * 1000)}</span>
                                    </div>
                                    <div className={`p-4 md:flex gap-6 items-center ${themeStyles.text}`}>
                                        <img src={drop.image} className={`w-20 h-20 object-cover border-2 ${themeStyles.border}`} />
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

    const VerifierView = () => {
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
            <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
                <button onClick={() => setView('profile')} className="absolute top-6 left-6 text-white underline font-mono">
                    &larr; Exit Partner Mode
                </button>

                <div className="w-full max-w-md border-4 border-white p-8 bg-gray-900 shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)]">
                    <h2 className="text-4xl font-black uppercase text-center mb-2 text-yellow-400">Verifier Tool</h2>
                    <p className="font-mono text-center text-gray-400 mb-8">Scan attendee QR codes to validate utility.</p>

                    <div className="relative aspect-square bg-gray-800 border-2 border-dashed border-gray-500 mb-6 flex items-center justify-center overflow-hidden">
                        {verifyStatus === 'scanning' && <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>}
                        {verifyStatus === 'success' ? (
                            <div className="text-center animate-bounce">
                                <ShieldCheck size={64} className="text-green-500 mx-auto mb-2" />
                                <h3 className="text-2xl font-black text-green-500">VALID TICKET</h3>
                                <p className="font-mono">User: Cyberpunk_01</p>
                            </div>
                        ) : verifyStatus === 'error' ? (
                            <div className="text-center animate-shake">
                                <X size={64} className="text-red-500 mx-auto mb-2" />
                                <h3 className="text-2xl font-black text-red-500">INVALID CODE</h3>
                            </div>
                        ) : (
                            <Scan size={48} className="text-gray-600" />
                        )}
                    </div>

                    <input
                        type="text"
                        placeholder="Enter Code (e.g. QR-1-8892)"
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        className="w-full bg-black border-2 border-white p-3 font-mono text-white mb-4 text-center uppercase"
                    />

                    <button
                        onClick={handleVerify}
                        className="w-full bg-white text-black font-black uppercase py-4 hover:bg-yellow-400 transition-colors"
                    >
                        {verifyStatus === 'scanning' ? 'Verifying...' : 'Verify Access'}
                    </button>

                    {verifyStatus === 'success' && (
                        <button onClick={() => { setVerifyStatus('idle'); setVerifyCode(''); }} className="mt-4 w-full text-center underline font-mono">
                            Scan Next
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const CreatorView = () => {
        const [creatorTab, setCreatorTab] = useState('create');
        const [airdropStatus, setAirdropStatus] = useState('idle');
        const [description, setDescription] = useState('');
        const [titleInput, setTitleInput] = useState('');
        const [categoryInput, setCategoryInput] = useState('Music');

        const handleAirdrop = () => {
            setAirdropStatus('sending');
            setTimeout(() => {
                setAirdropStatus('success');
                setShowConfetti(true);
                setTimeout(() => {
                    setShowConfetti(false);
                    setAirdropStatus('idle');
                }, 2500);
            }, 1500);
        };

        const handleAutoHype = async () => {
            setDescription('Generating hype...');
            const prompt = `Write a short, high-energy, youth-oriented hype description for an NFT drop titled '${titleInput || 'Untitled Drop'}' in the category '${categoryInput}'. Use emojis, slang, and keep it under 280 characters.`;
            const result = await callGemini(prompt);
            setDescription(result);
        };

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
                            <label className="block font-black uppercase mb-2 flex items-center gap-2">
                                Description
                                <button
                                    onClick={handleAutoHype}
                                    disabled={aiLoading}
                                    className={`text-xs px-2 py-1 rounded border-2 ${themeStyles.border} ${theme === 'night' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'} flex items-center gap-1 hover:brightness-110`}
                                >
                                    <Sparkles size={12} /> {aiLoading ? 'Thinking...' : 'Auto-Hype'}
                                </button>
                            </label>
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

    return (
        <div className={`min-h-screen ${themeStyles.bg} font-sans ${themeStyles.text} overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-300`}>
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
                {view === 'landing' && <LandingView />}
                {view === 'market' && <MarketplaceView />}
                {view === 'detail' && <DetailView />}
                {view === 'profile' && <ProfileView />}
                {view === 'mint' && <CreatorView />}
                {view === 'verifier' && <VerifierView />}
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
                <button onClick={toggleTheme} className={`flex flex-col items-center ${themeStyles.muted}`}><Moon size={20} /></button>
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        .text-stroke-2 {
          -webkit-text-stroke: 2px ${theme === 'night' ? 'white' : 'black'};
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
        </div>
    );
}