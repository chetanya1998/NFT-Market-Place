export const THEMES = {
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

export const INITIAL_DROPS = [
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

export const ANALYTICS_DATA = {
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
