import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { THEMES } from '../constants/data';

export const TiltCard = ({ children, onClick, className, theme }) => {
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

export const FunkyButton = ({ children, onClick, theme, color, textColor, className = "", disabled = false }) => {
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

export const Marquee = ({ text, theme }) => {
    const styles = THEMES[theme];
    return (
        <div className={`${theme === 'night' ? 'bg-green-900 border-green-500' : 'bg-black border-black'} ${styles.text} py-3 overflow-hidden border-y-4 whitespace-nowrap`}>
            <div className="animate-marquee inline-block font-mono font-bold text-lg text-white">
                {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp; {text} &nbsp; • &nbsp;
            </div>
        </div>
    );
};

export const CategoryPill = ({ icon: Icon, label, active, onClick, theme }) => {
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

export const XPToast = ({ amount, visible, theme }) => {
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
