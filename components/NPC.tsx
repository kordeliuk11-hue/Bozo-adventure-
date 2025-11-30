import React from 'react';
import { NPC as NPCType } from '../types';

interface NPCProps {
  npc: NPCType;
}

const StandardNPCSprite: React.FC = () => (
    <div className="w-full h-full grid grid-cols-4 grid-rows-4 relative">
        {/* Head & Hood */}
        <div className="bg-[#306230] col-start-1 col-span-4 row-start-1"></div>
        <div className="bg-[#306230] col-start-1 row-start-2"></div>
        <div className="bg-[#306230] col-start-4 row-start-2"></div>
        {/* Face */}
        <div className="bg-[#9bbc0f] col-start-2 col-span-2 row-start-2"></div>
        {/* Beard */}
        <div className="bg-[#8bac0f] col-start-2 col-span-2 row-start-3"></div>
        {/* Robe */}
        <div className="bg-[#0f380f] col-start-1 col-span-4 row-start-3"></div>
        <div className="bg-[#0f380f] col-start-2 col-span-2 row-start-4"></div>
    </div>
);

const PrincessSprite: React.FC = () => (
    <div className="w-full h-full grid grid-cols-4 grid-rows-4 relative">
        {/* Hair */}
        <div className="bg-[#8bac0f] col-start-1 col-span-4 row-start-1"></div>
        <div className="bg-[#8bac0f] col-start-1 row-start-2"></div>
        <div className="bg-[#8bac0f] col-start-4 row-start-2"></div>
        {/* Crown */}
        <div className="bg-[#306230] col-start-2 col-span-2 row-start-1" style={{boxShadow: '0 -2px #8bac0f'}}></div>
        {/* Face */}
        <div className="bg-[#9bbc0f] col-start-2 col-span-2 row-start-2"></div>
        {/* Dress */}
        <div className="bg-[#306230] col-start-1 row-start-3"></div>
        <div className="bg-[#0f380f] col-start-2 col-span-2 row-start-3"></div>
        <div className="bg-[#306230] col-start-4 row-start-3"></div>
        <div className="bg-[#306230] col-start-1 col-span-4 row-start-4"></div>
    </div>
);


const NPC: React.FC<NPCProps> = ({ npc }) => {
  return (
    <div
      style={{
        left: `${npc.pos.x}px`,
        top: `${npc.pos.y}px`,
        width: `${npc.size.x}px`,
        height: `${npc.size.y}px`,
      }}
      className="absolute"
    >
      {npc.type === 'princess' ? <PrincessSprite /> : <StandardNPCSprite />}
    </div>
  );
};

export default NPC;