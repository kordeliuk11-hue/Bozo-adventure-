import React, { useRef, useEffect, useState } from 'react';
import Game from './components/Game';
import Controls from './components/Controls';
import { usePlayerControls } from './hooks/usePlayerControls';
import { SCREEN_WIDTH, GAME_HEIGHT } from './constants';

const App: React.FC = () => {
  const { controls, setControls } = usePlayerControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const scaleX = clientWidth / SCREEN_WIDTH;
        const scaleY = clientHeight / GAME_HEIGHT;
        // Use the smaller scale factor to ensure it fits both width and height
        setScale(Math.min(scaleX, scaleY));
      }
    };

    window.addEventListener('resize', updateScale);
    // Call once on mount
    updateScale();
    
    // Small delay to handle layout shifts on mobile browsers
    setTimeout(updateScale, 100);
    
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center bg-slate-900 overflow-hidden">
      
      {/* Game Area - Takes available space */}
      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 min-h-0 overflow-hidden">
         <div 
            ref={containerRef}
            className="relative shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-black"
            style={{ 
                width: '100%',
                maxWidth: '800px',
                aspectRatio: `${SCREEN_WIDTH} / ${GAME_HEIGHT}`,
                maxHeight: '100%'
            }}
         >
             <div 
                className="origin-top-left pixel-art relative z-10"
                style={{ 
                    width: SCREEN_WIDTH, 
                    height: GAME_HEIGHT,
                    transform: `scale(${scale})` 
                }}
             >
                <Game controls={controls} />
             </div>

             {/* CRT Effects Overlay */}
             {/* Scanlines */}
             <div className="absolute inset-0 z-20 pointer-events-none crt-lines opacity-40"></div>
             {/* Vignette / Screen Curve Shadow */}
             <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] rounded-xl"></div>
             {/* Subtle Glow/Reflection */}
             <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-transparent to-white/5 opacity-30 rounded-xl"></div>
         </div>
      </div>

      {/* Controls Area - Fixed at bottom */}
      <div className="w-full max-w-[800px] px-4 pb-4 shrink-0 z-20">
          <Controls setControls={setControls} />
      </div>

      <div className="mb-2 text-slate-500 text-[10px] font-medium tracking-wide opacity-60">
         ADVENTURES OF BOZO • REMASTERED
      </div>
    </div>
  );
};

export default App;