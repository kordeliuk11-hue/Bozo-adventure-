
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { playMusic, stopMusic } from '../game/audio';

// Modern Text Box Component (Glassmorphism)
const TextBox: React.FC<{ text: string }> = ({ text }) => (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-slate-900/80 backdrop-blur-md text-white p-6 rounded-2xl border border-slate-700/50 shadow-xl z-30 text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
        <p className="text-sm sm:text-lg font-medium leading-relaxed font-sans tracking-wide text-slate-100 drop-shadow-sm">{text}</p>
    </div>
);

// --- INTRO FRAMES ---

const Frame1: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-sky-300">
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-200"></div>
        
        {/* Sun */}
        <div className="absolute top-8 right-8 w-20 h-20 bg-yellow-300 rounded-full blur-sm shadow-[0_0_40px_rgba(253,224,71,0.6)] animate-pulse"></div>

        {/* Clouds */}
        <div className="absolute top-20 left-10 w-32 h-10 bg-white/80 rounded-full blur-md opacity-80"></div>
        <div className="absolute top-32 right-1/4 w-40 h-12 bg-white/70 rounded-full blur-md opacity-60"></div>

        {/* Background Mountains */}
        <div className="absolute bottom-1/4 left-0 w-full h-1/2">
             <div className="absolute bottom-0 left-[-10%] w-[60%] h-full bg-emerald-800/30 rotate-12 transform origin-bottom-left blur-sm"></div>
             <div className="absolute bottom-0 right-[-10%] w-[70%] h-[80%] bg-emerald-800/20 -rotate-6 transform origin-bottom-right blur-sm"></div>
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-emerald-700 to-emerald-500"></div>

        {/* Castle */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 flex items-end drop-shadow-2xl">
            {/* Left Tower */}
            <div className="flex flex-col items-center -mr-2 z-0">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-blue-600"></div>
                <div className="w-10 h-32 bg-slate-400 border-r-4 border-slate-500 relative">
                    <div className="w-2 h-6 bg-slate-700 rounded-t-full absolute top-4 left-1/2 -translate-x-1/2"></div>
                </div>
            </div>
             {/* Main Keep */}
             <div className="flex flex-col items-center z-10">
                <div className="w-0 h-0 border-l-[35px] border-l-transparent border-r-[35px] border-r-transparent border-b-[50px] border-b-blue-700"></div>
                <div className="w-24 h-40 bg-slate-300 border-r-8 border-slate-400 relative flex justify-center items-end">
                     <div className="w-10 h-16 bg-slate-800 rounded-t-full border-4 border-slate-500"></div> {/* Gate */}
                     <div className="absolute top-8 w-6 h-10 bg-sky-900 rounded-t-full border-2 border-slate-400"></div> {/* Window */}
                </div>
            </div>
            {/* Right Tower */}
            <div className="flex flex-col items-center -ml-2 z-0">
                <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[40px] border-b-blue-600"></div>
                <div className="w-10 h-32 bg-slate-400 border-l-4 border-slate-500 relative">
                     <div className="w-2 h-6 bg-slate-700 rounded-t-full absolute top-4 left-1/2 -translate-x-1/2"></div>
                </div>
            </div>
        </div>

        {/* Princess Tiny Sprite */}
        <div className="absolute bottom-[47%] left-[52%] w-4 h-6 bg-pink-500 rounded-t-lg shadow-sm"></div>
        <div className="absolute bottom-[49%] left-[52%] w-4 h-4 bg-amber-200 rounded-full"></div>

        <TextBox text="In the peaceful kingdom of Elfioria, the sun shone bright..." />
    </div>
);

const Frame2: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-indigo-950">
        {/* Darkened Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-900 to-slate-900"></div>
        
        {/* Eclipsed Moon */}
        <div className="absolute top-12 right-12 w-24 h-24 bg-red-900 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.6)] border border-red-700"></div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/3 bg-slate-900 opacity-90"></div>

        {/* Castle Silhouette */}
        <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 flex items-end opacity-40 grayscale blur-[1px]">
             <div className="w-24 h-40 bg-slate-800"></div>
        </div>

        {/* Sorcerer */}
        <div className="absolute top-[30%] right-[25%] animate-bounce duration-[2000ms]">
            <div className="relative w-24 h-32">
                {/* Aura */}
                <div className="absolute -inset-8 bg-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                
                {/* Robe */}
                <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-purple-900 absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                
                {/* Head */}
                <div className="w-12 h-12 bg-black rounded-full absolute top-4 left-1/2 -translate-x-1/2 shadow-lg"></div>
                
                {/* Glowing Eyes */}
                <div className="w-2 h-2 bg-red-500 absolute top-8 left-9 shadow-[0_0_8px_red] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 absolute top-8 right-9 shadow-[0_0_8px_red] rounded-full animate-pulse"></div>
            </div>
        </div>

        <TextBox text="...until the dark Sorcerer Grolnok descended from the shadows." />
    </div>
);

const Frame3: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-indigo-950">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-purple-900"></div>
        
        {/* Flying away composition */}
        
        {/* Stars rushing by (simple lines) */}
        <div className="absolute top-10 left-10 w-32 h-1 bg-white/20 rotate-12 blur-sm"></div>
        <div className="absolute top-40 right-20 w-40 h-1 bg-white/20 -rotate-6 blur-sm"></div>
        <div className="absolute bottom-20 left-1/2 w-20 h-1 bg-white/20 rotate-45 blur-sm"></div>

        {/* Sorcerer & Princess Small */}
        <div className="absolute top-1/3 left-1/2 animate-[flyAway_5s_linear_infinite]">
             {/* Sorcerer */}
            <div className="absolute w-16 h-20 bg-purple-900 rounded-full blur-[1px]"></div>
            {/* Princess Cage/Magic */}
            <div className="absolute top-10 -left-10 w-12 h-12 bg-pink-500/30 border-2 border-pink-400 rounded-full shadow-[0_0_20px_pink] flex items-center justify-center animate-spin duration-[3000ms]">
                 <div className="w-4 h-6 bg-pink-500 rounded-t-lg"></div>
            </div>
        </div>
        
        <style>{`
            @keyframes flyAway {
                0% { transform: translate(-100px, 100px) scale(1.2); opacity: 1; }
                100% { transform: translate(200px, -200px) scale(0.5); opacity: 0; }
            }
        `}</style>

        <TextBox text="He captured Princess Elara, sealing her away in his obsidian tower!" />
    </div>
);

const Frame4: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-sky-400">
        {/* Heroic Background */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-300 to-sky-400"></div>
        
        {/* Sun rays */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-full bg-gradient-to-t from-yellow-200/20 to-transparent rotate-45"></div>

        {/* Hill */}
        <div className="absolute bottom-[-10%] left-0 w-full h-1/2 bg-emerald-600 rounded-t-[100%] scale-150"></div>

        {/* Bozo Back View (Heroic Pose) */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 transform scale-150">
             <div className="relative flex flex-col items-center">
                 {/* Hat */}
                 <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-emerald-500 relative z-20 -mb-2">
                     <div className="absolute -right-3 -top-2 w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div> {/* Bell/Pom */}
                 </div>
                 
                 {/* Head */}
                 <div className="w-12 h-12 bg-amber-200 rounded-full z-10 relative shadow-md">
                      {/* Ears */}
                      <div className="absolute top-4 -left-2 w-3 h-8 bg-amber-200 rounded-l-full rotate-12"></div>
                      <div className="absolute top-4 -right-2 w-3 h-8 bg-amber-200 rounded-r-full -rotate-12"></div>
                 </div>

                 {/* Body */}
                 <div className="w-16 h-20 bg-emerald-600 rounded-t-2xl -mt-2 z-0 relative shadow-inner flex justify-center">
                      {/* Belt */}
                      <div className="w-18 h-4 bg-amber-900 absolute bottom-6 w-full"></div>
                      <div className="w-5 h-5 bg-yellow-500 absolute bottom-5 rounded-sm border-2 border-amber-800"></div>
                 </div>
                 
                 {/* Sword Hilt sticking out */}
                 <div className="absolute top-12 -right-4 w-4 h-12 bg-slate-700 rotate-45 z-[-1]">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-400"></div>
                     <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-500 rounded-full"></div>
                 </div>
             </div>
        </div>

        <TextBox text="But Bozo the Elf grasped his sword. The adventure begins now!" />
    </div>
);

// --- ENDING FRAMES ---

const EndFrame1: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
        {/* Tower Interior */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black"></div>
        
        {/* Fading Sorcerer */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 opacity-0 animate-[fadeOut_3s_ease-in_forwards]">
            <div className="w-32 h-40 bg-black blur-xl rounded-full"></div>
        </div>
         <style>{`
            @keyframes fadeOut {
                0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50px) scale(1.5); }
            }
        `}</style>
        
        {/* Bozo Panting */}
        <div className="absolute bottom-1/4 left-1/3 transform scale-125">
             <div className="w-12 h-12 bg-amber-200 rounded-full relative">
                 <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-emerald-500 absolute -top-4 -left-2 rotate-[-10deg]"></div>
                  {/* Sweat */}
                 <div className="absolute -right-2 top-0 w-2 h-3 bg-blue-300 rounded-full animate-bounce"></div>
             </div>
             <div className="w-14 h-16 bg-emerald-600 rounded-t-xl -mt-1 relative">
                {/* Sword down */}
                <div className="absolute top-4 -right-6 w-2 h-16 bg-slate-300 rotate-[120deg] origin-top">
                    <div className="absolute -top-2 -left-2 w-6 h-2 bg-amber-800"></div>
                </div>
             </div>
        </div>

        <TextBox text="With a final strike, Grolnok vanished into the void!" />
    </div>
);

const EndFrame2: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800 via-slate-900 to-black"></div>
        
        {/* Cage Dissolving */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 h-60 border-4 border-purple-500 rounded-t-full animate-[pulse_1s_ease-out_infinite]">
             <div className="absolute inset-0 bg-purple-500/20 animate-[ping_2s_linear_infinite]"></div>
        </div>

        {/* Princess Stepping Out */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 z-10 animate-[slideUp_2s_ease-out]">
             {/* Hair */}
             <div className="w-16 h-20 bg-yellow-400 rounded-full absolute -top-4 -left-2"></div>
             {/* Crown */}
             <div className="w-12 h-4 bg-yellow-500 absolute -top-6 left-0 flex gap-1">
                 <div className="w-2 h-4 bg-yellow-500 -mt-2"></div>
                 <div className="w-2 h-4 bg-yellow-500 -mt-2 mx-auto"></div>
                 <div className="w-2 h-4 bg-yellow-500 -mt-2"></div>
             </div>
             {/* Face */}
             <div className="w-12 h-12 bg-amber-100 rounded-full relative z-10"></div>
             {/* Dress */}
             <div className="w-20 h-32 bg-pink-500 rounded-t-3xl -mt-2 relative z-0">
                 <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-pink-400 to-pink-600 rounded-t-3xl"></div>
             </div>
        </div>
        <style>{`
            @keyframes slideUp {
                from { transform: translate(-50%, 20px); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `}</style>

        <TextBox text="The magical prison shattered. Princess Elara was free!" />
    </div>
);

const EndFrame3: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-pink-100">
        {/* Background Hearts */}
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="absolute text-pink-300 animate-pulse" 
                     style={{
                         left: `${Math.random() * 100}%`, 
                         top: `${Math.random() * 100}%`,
                         fontSize: `${Math.random() * 40 + 20}px`,
                         animationDelay: `${Math.random() * 2}s`
                     }}>
                    ♥
                </div>
            ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center transform scale-125 mt-10">
            {/* Bozo (Left) */}
            <div className="relative z-10 -mr-4">
                 <div className="w-14 h-14 bg-amber-200 rounded-full relative z-20">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-emerald-500 absolute -top-5 -left-2 rotate-[-15deg]"></div>
                    {/* Closed Eye Happy */}
                    <div className="absolute top-4 right-2 w-3 h-1 bg-black/50 rotate-45 rounded-full"></div>
                    <div className="absolute top-4 right-2 w-3 h-1 bg-black/50 -rotate-45 rounded-full"></div>
                 </div>
                 <div className="w-16 h-20 bg-emerald-600 rounded-t-2xl -mt-2 relative z-10">
                     {/* Arm hugging */}
                     <div className="absolute top-4 -right-6 w-12 h-4 bg-emerald-600 rotate-12 rounded-full z-30"></div>
                 </div>
            </div>

            {/* Princess (Right) */}
            <div className="relative z-0 -ml-4">
                 <div className="w-16 h-20 bg-yellow-400 rounded-full absolute -top-4 -right-2"></div>
                 <div className="w-14 h-14 bg-amber-100 rounded-full relative z-20">
                    <div className="w-12 h-4 bg-yellow-500 absolute -top-4 left-1"></div>
                     {/* Closed Eye Happy */}
                    <div className="absolute top-4 left-2 w-3 h-1 bg-black/50 rotate-45 rounded-full"></div>
                    <div className="absolute top-4 left-2 w-3 h-1 bg-black/50 -rotate-45 rounded-full"></div>
                 </div>
                 <div className="w-18 h-24 bg-pink-500 rounded-t-3xl -mt-2 relative z-10">
                     {/* Arm hugging */}
                     <div className="absolute top-6 -left-4 w-12 h-4 bg-pink-400 -rotate-12 rounded-full z-30"></div>
                 </div>
            </div>
        </div>
        
        {/* Big Heart Pop */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 text-6xl text-red-500 animate-[bounce_1s_infinite] drop-shadow-lg">
            ♥
        </div>

        <TextBox text="&quot;My Hero!&quot; she cried. Bozo had saved the day!" />
    </div>
);

const EndFrame4: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-orange-200">
         {/* Sunrise Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-400 via-pink-300 to-blue-300"></div>
        
        {/* Rising Sun */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-200 rounded-full blur-xl opacity-80"></div>
        
        {/* Castle Silhouette */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/3 flex justify-center items-end opacity-60">
             <div className="w-20 h-40 bg-indigo-900 mx-1"></div>
             <div className="w-32 h-56 bg-indigo-900 mx-1 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-10 bg-indigo-900 -mt-8"></div>
                  <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-10 h-6 bg-indigo-900 skew-x-12"></div> {/* Flag */}
             </div>
             <div className="w-20 h-40 bg-indigo-900 mx-1"></div>
        </div>

        {/* Fireworks */}
        <div className="absolute top-10 left-10 text-4xl text-yellow-300 animate-ping">★</div>
        <div className="absolute top-20 right-20 text-4xl text-pink-300 animate-ping delay-300">★</div>
        <div className="absolute top-40 left-1/2 text-4xl text-white animate-ping delay-700">★</div>

        <TextBox text="Peace returned to Elfioria, and they lived happily ever after." />
    </div>
);

const INTRO_FRAMES = [
    <Frame1 key={1}/>,
    <Frame2 key={2}/>,
    <Frame3 key={3}/>,
    <Frame4 key={4}/>,
];

const ENDING_FRAMES = [
    <EndFrame1 key={1} />,
    <EndFrame2 key={2} />,
    <EndFrame3 key={3} />,
    <EndFrame4 key={4} />,
];


interface CutsceneProps {
    onFinished: () => void;
}

const Cutscene: React.FC<CutsceneProps> = ({ onFinished }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        playMusic('CUTSCENE');
        return () => {
            stopMusic();
        };
    }, []);

    const advanceFrame = useCallback(() => {
        setCurrentFrame(prev => {
            if (prev >= INTRO_FRAMES.length - 1) {
                onFinished();
                return prev;
            }
            return prev + 1;
        });
    }, [onFinished]);

    useEffect(() => {
        timeoutRef.current = setTimeout(advanceFrame, 5000);
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentFrame, advanceFrame]);

    const handleSkip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        onFinished();
    }

    return (
        <div className="w-full h-full relative cursor-pointer bg-black" onClick={advanceFrame}>
            {INTRO_FRAMES[currentFrame]}
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleSkip();
                }} 
                className="absolute top-4 right-4 px-4 py-2 bg-slate-900/50 hover:bg-slate-800/80 backdrop-blur-md text-white border border-slate-600 rounded-full z-40 text-xs font-bold tracking-wider transition-all"
            >
                SKIP INTRO
            </button>
        </div>
    );
}

export const EndingCutscene: React.FC<CutsceneProps> = ({ onFinished }) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        playMusic('CUTSCENE');
        return () => {
            stopMusic();
        };
    }, []);

    const advanceFrame = useCallback(() => {
        setCurrentFrame(prev => {
            if (prev >= ENDING_FRAMES.length - 1) {
                onFinished();
                return prev;
            }
            return prev + 1;
        });
    }, [onFinished]);

    useEffect(() => {
        timeoutRef.current = setTimeout(advanceFrame, 6000); // Slightly longer for ending
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentFrame, advanceFrame]);

    const handleSkip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        onFinished();
    }

    return (
        <div className="w-full h-full relative cursor-pointer bg-black" onClick={advanceFrame}>
            {ENDING_FRAMES[currentFrame]}
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    handleSkip();
                }} 
                className="absolute top-4 right-4 px-4 py-2 bg-slate-900/50 hover:bg-slate-800/80 backdrop-blur-md text-white border border-slate-600 rounded-full z-40 text-xs font-bold tracking-wider transition-all"
            >
                SKIP
            </button>
        </div>
    );
}

export default Cutscene;
