import React from 'react';
import { Hazard as HazardType, HazardType as HType } from '../types';

interface HazardProps {
  hazard: HazardType;
}

const LavaPoolSprite: React.FC = () => (
    <div className="w-full h-full flex items-end">
        <div className="w-1/3 h-1/3 bg-[#E04000] rounded-t-full animate-pulse"></div>
        <div className="w-1/3 h-2/3 bg-[#FF7F50] rounded-t-full animate-pulse delay-75"></div>
        <div className="w-1/3 h-1/3 bg-[#E04000] rounded-t-full animate-pulse delay-150"></div>
    </div>
);

const Hazard: React.FC<HazardProps> = ({ hazard }) => {
  
  const renderSprite = () => {
    switch(hazard.type) {
        case HType.Lava:
            return <LavaPoolSprite />;
        default:
            return null;
    }
  }

  return (
    <div
      style={{
        left: `${hazard.pos.x}px`,
        top: `${hazard.pos.y}px`,
        width: `${hazard.size.x}px`,
        height: `${hazard.size.y}px`,
      }}
      className="absolute"
    >
        {renderSprite()}
    </div>
  );
};

export default Hazard;