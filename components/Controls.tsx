import React from 'react';
import { PlayerControls } from '../hooks/usePlayerControls';

interface ControlsProps {
  setControls: React.Dispatch<React.SetStateAction<PlayerControls>>;
}

const TouchButton: React.FC<{
    onTouchStart: () => void;
    onTouchEnd: () => void;
    className?: string;
    children?: React.ReactNode;
}> = ({ onTouchStart, onTouchEnd, className, children }) => (
    <div
        className={`backdrop-blur-sm bg-white/10 border border-white/20 active:bg-white/30 transition-all rounded-full flex items-center justify-center shadow-lg touch-none select-none ${className}`}
        onTouchStart={(e) => { e.preventDefault(); onTouchStart(); }}
        onTouchEnd={(e) => { e.preventDefault(); onTouchEnd(); }}
        onMouseDown={(e) => { e.preventDefault(); onTouchStart(); }}
        onMouseUp={(e) => { e.preventDefault(); onTouchEnd(); }}
    >
        {children}
    </div>
);

const Controls: React.FC<ControlsProps> = ({ setControls }) => {
  return (
    <div className="w-full flex flex-col pointer-events-auto">
      
      <div className="flex justify-between items-center">
        {/* D-Pad / Virtual Joystick Area */}
        <div className="relative w-40 h-40">
            {/* Left */}
            <TouchButton 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14"
                onTouchStart={() => setControls(c => ({...c, left: true, right: false}))} 
                onTouchEnd={() => setControls(c => ({...c, left: false}))}
            >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </TouchButton>
            
            {/* Right */}
            <TouchButton 
                 className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14"
                 onTouchStart={() => setControls(c => ({...c, right: true, left: false}))} 
                 onTouchEnd={() => setControls(c => ({...c, right: false}))}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </TouchButton>
            
             {/* Up (Jump alternative) */}
            <TouchButton 
                 className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14"
                 onTouchStart={() => setControls(c => ({...c, jump: true}))} 
                 onTouchEnd={() => setControls(c => ({...c, jump: false}))}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
            </TouchButton>
             
             {/* Down placeholder for visuals */}
             <TouchButton 
                 className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 opacity-30 pointer-events-none"
                 onTouchStart={() => {}} 
                 onTouchEnd={() => {}}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </TouchButton>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 items-end">
             <div className="flex flex-col gap-4 items-center justify-center">
                 {/* Weapon Switch */}
                 <TouchButton 
                    className="w-12 h-12 rounded-full !bg-amber-500/30 border-amber-300/50"
                    onTouchStart={() => setControls(c => ({...c, switchWeapon: true}))}
                    onTouchEnd={() => setControls(c => ({...c, switchWeapon: false}))}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16"/><path d="M4 20L20 4"/></svg>
                </TouchButton>
            </div>

             <div className="flex gap-4 items-center">
                {/* Attack (B) */}
                <TouchButton 
                    className="w-16 h-16 !bg-rose-500/40 border-rose-400/50"
                    onTouchStart={() => setControls(c => ({...c, attack: true}))}
                    onTouchEnd={() => setControls(c => ({...c, attack: false}))}
                >
                    <span className="font-black text-white drop-shadow-md">ATK</span>
                </TouchButton>

                {/* Jump (A) */}
                <TouchButton 
                    className="w-16 h-16 !bg-emerald-500/40 border-emerald-400/50 transform -translate-y-4"
                    onTouchStart={() => setControls(c => ({...c, jump: true}))}
                    onTouchEnd={() => setControls(c => ({...c, jump: false}))}
                >
                     <span className="font-black text-white drop-shadow-md">JMP</span>
                </TouchButton>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;