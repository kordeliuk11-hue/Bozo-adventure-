import React from 'react';
import { getLevelName } from '../game/level';

interface BackgroundProps {
  cameraX: number;
  levelIndex: number;
}

// Seedable RNG for consistent backgrounds
class RNG {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  nextInt(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

const BackgroundLayer: React.FC<{
  parallaxFactor: number;
  cameraX: number;
  imageUrl: string;
  zIndex: number;
}> = ({ parallaxFactor, cameraX, imageUrl, zIndex }) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        transform: `translateX(${-cameraX * parallaxFactor}px)`,
        backgroundImage: imageUrl,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 100%',
        zIndex: zIndex,
        imageRendering: 'pixelated',
      }}
    />
  );
};

// --- PIXEL ART GENERATORS ---

const createMountainPattern = (rng: RNG, color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Back mountains
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.moveTo(0, 128);
    for (let x = 0; x <= 256; x += 40) {
        ctx.lineTo(x + rng.nextInt(-10, 10), rng.nextInt(40, 90));
    }
    ctx.lineTo(256, 128);
    ctx.closePath();
    ctx.fill();

    // Front mountains
    ctx.fillStyle = color2;
    ctx.beginPath();
    ctx.moveTo(0, 128);
     for (let x = 0; x <= 256; x += 30) {
        ctx.lineTo(x + rng.nextInt(-10, 10), rng.nextInt(70, 110));
    }
    ctx.lineTo(256, 128);
    ctx.closePath();
    ctx.fill();
    return canvas.toDataURL();
}

const createForestPattern = (rng: RNG, color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const groundLevel = 110;
    
    // Back trees
    for (let i = 0; i < 15; i++) {
        const x = rng.nextInt(0, 256);
        const h = rng.nextInt(30, 80);
        const w = rng.nextInt(5, 10);
        ctx.fillStyle = color1;
        ctx.fillRect(x, groundLevel - h, w, h);
        ctx.beginPath();
        ctx.arc(x + w / 2, groundLevel - h, w * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Front trees
    for (let i = 0; i < 25; i++) {
        const x = rng.nextInt(0, 256);
        const h = rng.nextInt(20, 50);
        const w = rng.nextInt(4, 8);
        ctx.fillStyle = color2;
        ctx.fillRect(x, groundLevel - h, w, h);
        ctx.beginPath();
        ctx.arc(x + w / 2, groundLevel - h, w * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
    return canvas.toDataURL();
}

const createCavePattern = (rng: RNG, color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    for (let i = 0; i < 10; i++) { // Stalactites
        const x = rng.nextInt(0, 128);
        const h = rng.nextInt(10, 40);
        ctx.fillStyle = color1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - rng.nextInt(3, 8), h);
        ctx.lineTo(x + rng.nextInt(3, 8), h);
        ctx.closePath();
        ctx.fill();
    }
     for (let i = 0; i < 8; i++) { // Stalagmites
        const x = rng.nextInt(0, 128);
        const h = 128 - rng.nextInt(10, 30);
        ctx.fillStyle = color2;
        ctx.beginPath();
        ctx.moveTo(x, 128);
        ctx.lineTo(x - rng.nextInt(3, 8), h);
        ctx.lineTo(x + rng.nextInt(3, 8), h);
        ctx.closePath();
        ctx.fill();
    }
    return canvas.toDataURL();
}

const createCastlePattern = (rng: RNG, color1: string, color2: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    
    // Brick texture background
    ctx.fillStyle = color1;
    for(let y = 0; y < 128; y += 16) {
        for(let x = (y/16) % 2 === 0 ? 0 : -8; x < 256; x += 16) {
            ctx.fillRect(x, y, 15, 14);
        }
    }
    
    // Pillars
    ctx.fillStyle = color2;
    for(let i=0; i<3; i++){
        const x = rng.nextInt(0, 256);
        const h = rng.nextInt(40, 90);
        ctx.fillRect(x, 128-h, 20, h);
        ctx.fillRect(x-4, 128-h, 28, 8);
    }
    return canvas.toDataURL();
}

const createStarrySky = (rng: RNG, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    for (let i = 0; i < 50; i++) {
        ctx.globalAlpha = Math.random();
        ctx.fillRect(rng.nextInt(0, 256), rng.nextInt(0, 128), 1, 1);
    }
    return canvas.toDataURL();
}

const nameMatches = (name: string, keywords: string[]): boolean => {
    const lowerName = name.toLowerCase();
    return keywords.some(kw => lowerName.includes(kw.toLowerCase()));
};

const backgroundCache: { [key: number]: { factor: number; image: string; cssClass?: string }[] } = {};


const Background: React.FC<BackgroundProps> = ({ cameraX, levelIndex }) => {
  if (backgroundCache[levelIndex]) {
    const cachedBg = backgroundCache[levelIndex];
    return (
      <>
        {cachedBg.map((layer, i) => (
          <BackgroundLayer key={i} parallaxFactor={layer.factor} cameraX={cameraX} imageUrl={`url(${layer.image})`} zIndex={-10 + i} />
        ))}
      </>
    );
  }

  const levelName = getLevelName(levelIndex);
  const rng = new RNG(levelIndex);
  let generatedBg: { factor: number; image: string; cssClass?: string }[] = [];

  // Colors
  const C_CAVE_1 = '#334155'; // Slate 700
  const C_CAVE_2 = '#1e293b'; // Slate 800
  const C_FOREST_1 = '#15803d'; // Green 700
  const C_FOREST_2 = '#14532d'; // Green 900
  const C_MOUNTAIN_1 = '#64748b'; // Slate 500
  const C_MOUNTAIN_2 = '#475569'; // Slate 600
  const C_LAVA_1 = '#7f1d1d'; // Red 900
  const C_LAVA_2 = '#450a0a'; // Red 950
  const C_CASTLE_1 = '#475569'; 
  const C_CASTLE_2 = '#334155';

  if (nameMatches(levelName, ['Cavern', 'Mines', 'Abyss', 'Chasm', 'Depths', 'Gulch', 'Labyrinth', 'Trench', 'Sanctum', 'Vein', 'Core', 'Heart'])) {
    // Cave Theme: Purple/Dark Slate
    generatedBg = [
      { factor: 0.0, image: '', cssClass: 'bg-gradient-to-b from-slate-800 to-black' }, // Sky layer (static)
      { factor: 0.1, image: createCavePattern(rng, C_CAVE_1, C_CAVE_2) },
      { factor: 0.3, image: createCavePattern(rng, C_CAVE_2, '#0f172a') },
    ];
  } else if (nameMatches(levelName, ['Forest', 'Glade', 'Thicket', 'Elderwood', 'Mossy', 'Swamp', 'Fen', 'Verdant', 'Wood'])) {
     // Forest Theme: Green/Teal
     generatedBg = [
      { factor: 0.0, image: '', cssClass: 'bg-gradient-to-b from-sky-300 to-emerald-200' },
      { factor: 0.2, image: createForestPattern(rng, C_FOREST_1, C_FOREST_2) },
      { factor: 0.4, image: createForestPattern(rng, C_FOREST_2, '#064e3b') },
    ];
  } else if (nameMatches(levelName, ['Castle', 'Citadel', 'Ramparts', 'Keep', 'Tower', 'Armory', 'Halls', 'Monastery', 'Vault', 'Ruins', 'Palace', 'Keep'])) {
     // Castle Theme: Night Sky
     generatedBg = [
        { factor: 0.0, image: '', cssClass: 'bg-gradient-to-b from-indigo-900 to-slate-900' },
        { factor: 0.05, image: createStarrySky(rng, '#ffffff') },
        { factor: 0.3, image: createCastlePattern(rng, C_CASTLE_1, C_CASTLE_2) },
    ];
  } else if (nameMatches(levelName, ['Molten', 'Cinderfall', 'Skyfire', 'Obsidian', 'Dragon'])) {
     // Lava Theme: Red/Orange
     generatedBg = [
        { factor: 0.0, image: '', cssClass: 'bg-gradient-to-b from-orange-900 to-red-900' },
        { factor: 0.2, image: createMountainPattern(rng, C_LAVA_1, C_LAVA_2) },
        { factor: 0.4, image: createMountainPattern(rng, C_LAVA_2, '#000000') },
    ];
  } else { 
    // Default (Mountains/Hills): Blue Sky
    generatedBg = [
      { factor: 0.0, image: '', cssClass: 'bg-gradient-to-b from-sky-400 to-blue-200' },
      { factor: 0.1, image: createMountainPattern(rng, '#94a3b8', '#cbd5e1') }, // Far clouds/mountains
      { factor: 0.3, image: createMountainPattern(rng, C_MOUNTAIN_1, C_MOUNTAIN_2) },
    ];
  }

  backgroundCache[levelIndex] = generatedBg;

  return (
    <>
      {/* Base static gradient layer */}
      {generatedBg[0].cssClass && <div className={`absolute top-0 left-0 w-full h-full ${generatedBg[0].cssClass}`} style={{zIndex: -20}} />}
      
      {generatedBg.map((layer, i) => (
        layer.image ? (
            <BackgroundLayer
            key={i}
            parallaxFactor={layer.factor}
            cameraX={cameraX}
            imageUrl={`url(${layer.image})`}
            zIndex={-10 + i}
            />
        ) : null
      ))}
    </>
  );
};

export default Background;