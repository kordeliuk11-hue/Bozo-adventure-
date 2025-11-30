import React from 'react';
import { Projectile as ProjectileType } from '../types';

interface ProjectileProps {
  projectile: ProjectileType;
}

const FireballSprite: React.FC = () => (
    <div className="w-full h-full bg-[#8bac0f] border-2 border-[#0f380f] rounded-full" />
);

const MorningStarSprite: React.FC = () => (
    <div className="w-full h-full bg-[#306230] border-2 border-[#0f380f] rounded-full relative">
        <div className="absolute w-1/4 h-full bg-[#0f380f] left-1/2 top-0 -translate-x-1/2"></div>
        <div className="absolute w-full h-1/4 bg-[#0f380f] top-1/2 left-0 -translate-y-1/2"></div>
    </div>
);

const EnemyBulletSprite: React.FC = () => (
    <div className="w-full h-full bg-[#0f380f] border-2 border-[#8bac0f] rounded-sm" />
);


const Projectile: React.FC<ProjectileProps> = ({ projectile }) => {

  const renderSprite = () => {
    switch (projectile.type) {
        case 'morning_star':
            return <MorningStarSprite />;
        case 'fireball':
            return <FireballSprite />;
        case 'enemy_bullet':
            return <EnemyBulletSprite />;
        default:
            return null;
    }
  }


  return (
    <div
      style={{
        left: `${projectile.pos.x}px`,
        top: `${projectile.pos.y}px`,
        width: `${projectile.size.x}px`,
        height: `${projectile.size.y}px`,
      }}
      className="absolute"
    >
        {renderSprite()}
    </div>
  );
};

export default Projectile;
