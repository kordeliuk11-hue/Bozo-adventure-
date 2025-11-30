import React from 'react';
import { TileType } from '../types';

interface ItemProps {
  type: TileType;
  style: React.CSSProperties;
}

const TreasureChest: React.FC = () => (
    <div className="w-full h-full flex flex-col">
        <div className="h-1/4 bg-amber-800 rounded-t-sm"></div>
        <div className="h-1/2 bg-amber-600 border-y-2 border-amber-900 flex items-center justify-center">
            <div className="w-1/4 h-1/2 bg-yellow-400 rounded-sm shadow-sm"></div>
        </div>
        <div className="h-1/4 bg-amber-800 rounded-b-sm"></div>
    </div>
);

const SwordItem: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center transform -rotate-45">
        <div className="w-1/4 h-3/4 bg-slate-200 border border-slate-400 rounded-t-sm"></div>
        <div className="w-1/2 h-1/4 bg-amber-800 absolute rounded-sm"></div>
        <div className="w-1/4 h-1/4 bg-amber-900 absolute bottom-0 rounded-full"></div>
    </div>
);

const FireballItem: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-orange-500 border-2 border-red-600 rounded-full relative shadow-[0_0_10px_orange]">
            <div className="absolute w-1/2 h-1/2 bg-yellow-300 top-1/4 left-1/4 rounded-full animate-pulse"></div>
        </div>
    </div>
);

const AxeItem: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center transform rotate-45">
         <div className="w-1/2 h-1/4 bg-slate-300 absolute top-[25%] rounded-sm border border-slate-500"></div>
        <div className="w-1/4 h-3/4 bg-amber-900 absolute rounded-sm"></div>
    </div>
);

const MorningStarItem: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-1/4 h-full bg-amber-900 rounded-sm"></div>
        <div className="w-1/2 h-1/2 bg-slate-700 absolute right-0 border-2 border-slate-400 rounded-full">
            <div className="absolute top-0 left-1/2 w-px h-full bg-slate-400"></div>
        </div>
    </div>
);

const SpikeSprite: React.FC = () => (
    <div className="w-full h-full flex items-end justify-center">
        <div style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '16px solid #94a3b8', // Slate-400
        }} />
    </div>
);

const HealthPackSprite: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center relative animate-bounce">
        <div className="w-3/4 h-3/4 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-100">
            <div className="w-1/2 h-1/6 bg-red-500 absolute"></div>
            <div className="h-1/2 w-1/6 bg-red-500 absolute"></div>
        </div>
    </div>
)


const Item: React.FC<ItemProps> = ({ type, style }) => {
  const renderItem = () => {
    switch (type) {
      case TileType.Goal:
        return <TreasureChest />;
      case TileType.Sword:
        return <SwordItem />;
      case TileType.Fireball:
        return <FireballItem />;
      case TileType.Axe:
        return <AxeItem />;
      case TileType.MorningStar:
        return <MorningStarItem />;
      case TileType.Spike:
        return <SpikeSprite />;
      case TileType.HealthPack:
        return <HealthPackSprite />;
      default:
        return null;
    }
  };

  return (
    <div className="absolute" style={style}>
      {renderItem()}
    </div>
  );
};

export default Item;