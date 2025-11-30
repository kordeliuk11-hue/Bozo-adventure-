import React from 'react';
import { Enemy as EnemyType, EnemyType as EType } from '../types';

interface EnemyProps {
  enemy: EnemyType;
}

const SlimeSprite: React.FC = () => (
    <div className="w-full h-full flex flex-col">
        <div className="h-1/4"></div>
        <div className="h-1/4 flex opacity-80">
            <div className="w-1/4"></div>
            <div className="w-1/2 bg-cyan-400 rounded-t-full"></div>
            <div className="w-1/4"></div>
        </div>
        <div className="h-1/2 bg-cyan-500 rounded-t-lg flex items-center justify-center gap-1">
             {/* Eyes */}
             <div className="w-1 h-1 bg-black/50 rounded-full"></div>
             <div className="w-1 h-1 bg-black/50 rounded-full"></div>
        </div>
    </div>
);

const LavaSlimeSprite: React.FC = () => (
    <div className="w-full h-full flex flex-col">
        <div className="h-1/4"></div>
        <div className="h-1/4 flex">
            <div className="w-1/4"></div>
            <div className="w-1/2 bg-orange-400 rounded-t-full animate-pulse"></div>
            <div className="w-1/4"></div>
        </div>
        <div className="h-1/2 bg-orange-600 rounded-t-lg border-2 border-orange-400"></div>
    </div>
);

const BatSprite: React.FC = () => (
    <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-full h-1/2 bg-purple-900 flex items-end rounded-t-full">
            <div className="w-1/3 h-1/2 bg-purple-600 rounded-br-full"></div>
            <div className="w-1/3 h-full flex justify-center items-center gap-1">
                 <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                 <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            </div>
            <div className="w-1/3 h-1/2 bg-purple-600 rounded-bl-full"></div>
        </div>
        <div className="w-1/2 h-1/2 bg-purple-800 rounded-b-full"></div>
    </div>
);

const SpikySlimeSprite: React.FC = () => (
    <div className="w-full h-full flex flex-col relative">
        <div className="absolute w-full h-1/4 top-0 flex justify-around">
            <div className="w-1/4 h-full bg-slate-200 transform -rotate-45"></div>
            <div className="w-1/4 h-full bg-slate-200 transform"></div>
            <div className="w-1/4 h-full bg-slate-200 transform rotate-45"></div>
        </div>
        <div className="h-1/4"></div>
         <div className="h-1/4 flex">
            <div className="w-1/4"></div>
            <div className="w-1/2 bg-red-700 rounded-t-full"></div>
            <div className="w-1/4"></div>
        </div>
        <div className="h-1/2 bg-red-600 rounded-t-lg"></div>
    </div>
);

const ShooterSprite: React.FC = () => (
    <div className="w-full h-full flex flex-col">
        <div className="h-1/4"></div>
        <div className="h-1/2 bg-slate-600 flex items-center justify-center rounded-t-md border-t-2 border-x-2 border-slate-400 relative">
            <div className="w-1/2 h-1/2 bg-black rounded-full border-2 border-red-500"></div>
        </div>
        <div className="h-1/4 bg-slate-800 rounded-b-sm"></div>
    </div>
);

const GhostSprite: React.FC = () => (
    <div className="w-full h-full flex flex-col opacity-60">
        <div className="h-1/2 bg-white rounded-t-full flex items-center justify-evenly">
            <div className="w-1/4 h-1/2 bg-black rounded-full"></div>
            <div className="w-1/4 h-1/2 bg-black rounded-full"></div>
        </div>
        <div className="h-1/2 bg-white flex">
            <div className="w-1/4 h-full rounded-br-full bg-slate-200"></div>
            <div className="w-1/2 h-full"></div>
            <div className="w-1/4 h-full rounded-bl-full bg-slate-200"></div>
        </div>
    </div>
);

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  
  const renderSprite = () => {
    switch(enemy.type) {
        case EType.Bat:
            return <BatSprite />;
        case EType.SpikySlime:
            return <SpikySlimeSprite />;
        case EType.Shooter:
            return <ShooterSprite />;
        case EType.Ghost:
            return <GhostSprite />;
        case EType.LavaSlime:
            return <LavaSlimeSprite />;
        case EType.Slime:
        default:
            return <SlimeSprite />;
    }
  }

  return (
    <div
      style={{
        left: `${enemy.pos.x}px`,
        top: `${enemy.pos.y}px`,
        width: `${enemy.size.x}px`,
        height: `${enemy.size.y}px`,
      }}
      className="absolute"
    >
        {renderSprite()}
    </div>
  );
};

export default Enemy;