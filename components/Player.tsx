import React, { useState, useEffect, useRef } from 'react';
import { Player as PlayerType } from '../types';

interface PlayerProps {
  player: PlayerType;
}

const HorseSprite: React.FC<{animationFrame: number}> = ({animationFrame}) => {
    const legStyle1 = { transform: animationFrame === 0 ? 'rotate(20deg)' : 'rotate(-20deg)', transition: 'transform 200ms linear', transformOrigin: 'top' };
    const legStyle2 = { transform: animationFrame === 0 ? 'rotate(-20deg)' : 'rotate(20deg)', transition: 'transform 200ms linear', transformOrigin: 'top' };

    return (
        <div className="w-[150%] h-full absolute bottom-0 left-[-25%]">
            {/* Tail */}
            <div className="w-1/4 h-1/3 bg-amber-800 absolute top-[25%] -left-1 transform -rotate-45"></div>
            {/* Body */}
            <div className="w-full h-3/4 bg-amber-600 absolute bottom-0 rounded-t-md border-2 border-amber-800"></div>
            {/* Head */}
            <div className="w-1/2 h-1/2 bg-amber-600 absolute -top-4 -right-4 rounded-b-md border-2 border-amber-800">
                <div className="w-1/4 h-1/4 bg-black absolute top-2 left-2 rounded-full"></div>
            </div>
             {/* Legs */}
            <div className="w-1/4 h-1/2 bg-amber-700 absolute bottom-[-5px] left-0" style={legStyle1}></div>
            <div className="w-1/4 h-1/2 bg-amber-800 absolute bottom-[-5px] left-2 opacity-80" style={legStyle2}></div>
            <div className="w-1/4 h-1/2 bg-amber-700 absolute bottom-[-5px] right-0" style={legStyle2}></div>
            <div className="w-1/4 h-1/2 bg-amber-800 absolute bottom-[-5px] right-2 opacity-80" style={legStyle1}></div>
        </div>
    )
}

const SwordSprite: React.FC<{player: PlayerType}> = ({player}) => (
    <div className={`absolute w-1/2 h-full top-0 ${player.direction > 0 ? 'left-3/4' : 'right-3/4'} transition-transform duration-100`}
        style={{ transform: player.isAttacking ? (player.direction > 0 ? 'rotate(45deg)' : 'rotate(-45deg)') : 'rotate(0deg)'}}
    >
        <div className="w-full h-full flex flex-col items-center">
        <div className="w-1/2 h-3/4 bg-slate-300 border border-slate-500 rounded-t-sm"></div>
        <div className="w-full h-1/4 bg-amber-700 rounded-sm"></div>
        </div>
    </div>
);

const AxeSprite: React.FC<{player: PlayerType}> = ({player}) => (
    <div className={`absolute w-3/4 h-3/4 top-0 ${player.direction > 0 ? 'left-1/2' : 'right-1/2'} transition-transform duration-100`}
        style={{ transformOrigin: 'bottom', transform: player.isAttacking ? (player.direction > 0 ? 'rotate(60deg)' : 'rotate(-60deg)') : 'rotate(20deg)'}}
    >
        <div className="w-full h-1/4 bg-slate-400 rounded-sm border border-slate-600"></div>
        <div className="w-1/4 h-3/4 bg-amber-800 mx-auto"></div>
    </div>
);

const MorningStarSprite: React.FC<{player: PlayerType}> = ({player}) => (
     <div className={`absolute w-1/2 h-full top-0 ${player.direction > 0 ? 'left-3/4' : 'right-3/4'} transition-transform duration-100 flex items-center`}>
        <div className="w-full h-1/4 bg-amber-800 rounded-full"></div>
        <div className="w-1/2 h-1/2 bg-slate-800 absolute right-0 rounded-full border-2 border-slate-400"></div>
    </div>
);

const PlayerSprite: React.FC<{player: PlayerType; animationFrame: number}> = ({player, animationFrame}) => {
    
    const renderWeapon = () => {
        if (!player.hasSword && !player.hasAxe && !player.hasMorningStar) return null;

        switch (player.currentWeapon) {
            case 'sword':
                if (player.hasSword) return <SwordSprite player={player} />;
                return null;
            case 'axe':
                if (player.hasAxe) return <AxeSprite player={player} />;
                return null;
            case 'morning_star':
                 if (player.hasMorningStar) return <MorningStarSprite player={player} />;
                return null;
            default:
                return null;
        }
    }

    const isMoving = player.velocity.x !== 0 && player.isGrounded;

    const head = (
        <>
            <div className="bg-emerald-500 col-start-1 row-start-1 rounded-tl-lg"></div> {/* Hat */}
            <div className="bg-amber-900 col-start-2 col-span-2 row-start-1"></div> {/* Hair */}
            <div className="bg-emerald-500 col-start-4 row-start-1 rounded-tr-lg"></div> {/* Hat */}
            <div className="bg-amber-200 col-start-2 col-span-2 row-start-2 border-l border-r border-amber-300"></div> {/* Face */}
        </>
    );
    
    let bodyAndLimbs;

    if (player.onHorse) {
        bodyAndLimbs = (
            <>
                <div className="bg-emerald-600 col-start-2 col-span-2 row-start-3"></div>
                <div className="bg-emerald-400 col-start-1 row-start-3 rounded-full"></div>
                <div className="bg-emerald-400 col-start-4 row-start-3 rounded-full"></div>
                <div className="bg-amber-800 col-start-2 row-start-4 h-1/2 self-end"></div>
                <div className="bg-amber-800 col-start-3 row-start-4 h-1/2 self-end"></div>
            </>
        );
    } else if (!isMoving) {
        bodyAndLimbs = (
            <>
                <div className="bg-emerald-600 col-start-1 row-start-2 rounded-l-md"></div>
                <div className="bg-emerald-600 col-start-4 row-start-2 rounded-r-md"></div>
                <div className="bg-emerald-500 col-start-2 col-span-2 row-start-3"></div>
                <div className="bg-amber-200 col-start-1 row-start-3 rounded-full scale-75"></div>
                <div className="bg-amber-200 col-start-4 row-start-3 rounded-full scale-75"></div>
                <div className="bg-amber-800 col-start-2 row-start-4 rounded-b-md"></div>
                <div className="bg-amber-800 col-start-3 row-start-4 rounded-b-md"></div>
            </>
        );
    } else if (animationFrame === 0) {
        bodyAndLimbs = (
            <>
                <div className="bg-emerald-500 col-start-2 col-span-2 row-start-3"></div>
                <div className="bg-amber-200 col-start-1 row-start-2 rounded-full scale-75"></div>
                <div className="bg-emerald-600 col-start-4 row-start-2 rounded-r-md"></div>
                <div className="bg-amber-800 col-start-2 row-start-4 rounded-bl-md"></div>
                <div className="bg-amber-800 col-start-4 row-start-4 rounded-br-md"></div>
            </>
        );
    } else {
        bodyAndLimbs = (
            <>
                <div className="bg-emerald-500 col-start-2 col-span-2 row-start-3"></div>
                <div className="bg-emerald-600 col-start-1 row-start-2 rounded-l-md"></div>
                <div className="bg-amber-200 col-start-4 row-start-2 rounded-full scale-75"></div>
                <div className="bg-amber-800 col-start-1 row-start-4 rounded-bl-md"></div>
                <div className="bg-amber-800 col-start-3 row-start-4 rounded-br-md"></div>
            </>
        );
    }

    return (
      <div className="w-full h-full grid grid-cols-4 grid-rows-4 relative">
        {head}
        {bodyAndLimbs}
        {!player.onHorse && renderWeapon()}
      </div>
    );
};


const Player: React.FC<PlayerProps> = ({ player }) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const isAnimating = (player.velocity.x !== 0 && player.isGrounded) || player.onHorse;

    if (isAnimating && !animationIntervalRef.current) {
        animationIntervalRef.current = setInterval(() => {
            setAnimationFrame(frame => (frame + 1) % 2);
        }, 200);
    } else if (!isAnimating && animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
        setAnimationFrame(0);
    }

    return () => {
        if (animationIntervalRef.current) {
            clearInterval(animationIntervalRef.current);
        }
    };
  }, [player.velocity.x, player.isGrounded, player.onHorse]);

  return (
    <div
      style={{
        left: `${player.pos.x}px`,
        top: `${player.pos.y}px`,
        width: `${player.size.x}px`,
        height: `${player.onHorse ? player.size.y * 1.5 : player.size.y}px`,
        transform: `scaleX(${player.direction})`,
        opacity: player.invincibilityBonusCooldown <= 0 && player.invincibilityCooldown > 0 && !player.onHorse ? 0.5 : 1,
        filter: player.invincibilityBonusCooldown > 0 ? 'drop-shadow(0 0 5px #fbbf24) brightness(1.2)' : 'none',
        transition: 'opacity 100ms linear, filter 200ms linear',
      }}
      className="absolute"
    >
      {player.onHorse && <HorseSprite animationFrame={animationFrame} />}
      <div 
          className="absolute w-full"
          style={{ 
              height: `${player.size.y}px`,
              bottom: player.onHorse ? '25%' : '0'
          }}
      >
          <PlayerSprite player={player} animationFrame={animationFrame} />
      </div>
    </div>
  );
};

export default Player;