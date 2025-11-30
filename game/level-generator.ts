import { TileType, EnemyType } from '../types';
import { LEVEL_WIDTH, LEVEL_HEIGHT } from '../constants';

// Seedable random number generator for consistent levels
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
  chance(probability: number) {
    return this.next() < probability;
  }
}

export const generateLevel = (levelIndex: number): TileType[][] => {
  const rng = new RNG(levelIndex);
  const level: TileType[][] = Array.from({ length: LEVEL_HEIGHT }, () => Array(LEVEL_WIDTH).fill(TileType.Empty));

  // --- Difficulty scaling parameters ---
  const difficulty = levelIndex / 50; // A value from 0 to 1
  const pitChance = 0.1 + difficulty * 0.15;
  const maxPitWidth = 2 + Math.floor(difficulty * 3);
  const maxPlatformHeight = 3 + Math.floor(difficulty * 2);
  const enemyChance = 0.1 + difficulty * 0.2;
  const trapChance = 0.05 + difficulty * 0.1;
  const itemChance = 0.05 + (1 - difficulty) * 0.1; // More items in early levels

  let currentY = LEVEL_HEIGHT - 3;
  let currentX = 1;
  let hasPlacedHealthPack = false;
  let hasPlacedFireball = false;

  // Place player start
  level[currentY - 1][currentX] = TileType.PlayerStart;

  // Walker algorithm to carve the main path
  while (currentX < LEVEL_WIDTH - 10) {
    // Place ground
    for (let y = currentY; y < LEVEL_HEIGHT; y++) {
      if (level[y][currentX] === TileType.Empty) {
        level[y][currentX] = TileType.Ground;
      }
    }

    // Decide next step
    const nextStep = rng.nextInt(1, 10);

    if (rng.chance(pitChance) && currentX < LEVEL_WIDTH - 15) {
      const pitWidth = rng.nextInt(2, maxPitWidth);
      currentX += pitWidth;
    } else {
      if (nextStep <= 2) { // Go up
        currentY = Math.max(5, currentY - rng.nextInt(1, 2));
      } else if (nextStep <= 4) { // Go down
        currentY = Math.min(LEVEL_HEIGHT - 3, currentY + rng.nextInt(1, 2));
      }
      currentX++;
    }
  }

  // Final platform and Goal
  for (let x = currentX; x < LEVEL_WIDTH - 2; x++) {
      for (let y = currentY; y < LEVEL_HEIGHT; y++) {
          level[y][x] = TileType.Ground;
      }
  }
  
  const goalX = LEVEL_WIDTH - 5;
  const npcX = goalX - 2;

  // Place special characters or the final goal
  if (levelIndex === 49) { // Final level (level 50)
    level[currentY - 1][goalX] = TileType.Princess;
  } else {
    level[currentY - 1][goalX] = TileType.Goal;
    // Check if an NPC should be placed on this level
    if (levelIndex === 0 || [4, 9, 14, 19, 24, 29, 34, 39, 44].includes(levelIndex)) {
       level[currentY - 1][npcX] = TileType.NPC;
    }
  }


  // Decorate the level (second pass)
  for (let x = 1; x < LEVEL_WIDTH - 1; x++) {
    for (let y = 1; y < LEVEL_HEIGHT - 2; y++) {
      // Find ground surfaces
      if (level[y][x] === TileType.Ground && level[y - 1][x] === TileType.Empty) {
        // Place Enemies
        if (rng.chance(enemyChance)) {
          const enemyRoll = rng.next();
          if (difficulty > 0.8 && enemyRoll > 0.85) {
            level[y-1][x] = TileType.GhostStart;
          } else if (difficulty > 0.6 && enemyRoll > 0.8) {
            level[y-1][x] = TileType.LavaSlimeStart;
          } else if (difficulty > 0.5 && enemyRoll > 0.7) {
             level[y - 1][x] = TileType.ShooterStart;
          } else if (difficulty > 0.3 && enemyRoll > 0.6) {
             level[y - 1][x] = TileType.SpikySlimeStart;
          } else if (enemyRoll > 0.4) {
             level[y - 1][x] = TileType.BatStart;
          } else {
             level[y - 1][x] = TileType.EnemyStart;
          }
        }
        // Place Traps
        else if (rng.chance(trapChance)) {
          level[y][x] = TileType.Spike;
        }
        // Place Items
        else if (rng.chance(itemChance)) {
           const itemRoll = rng.next();
           if (itemRoll > 0.5 && !hasPlacedHealthPack) {
               level[y - 1][x] = TileType.HealthPack;
               hasPlacedHealthPack = true;
           } else if (!hasPlacedFireball) {
               level[y - 1][x] = TileType.Fireball;
               hasPlacedFireball = true;
           }
        }
      }
      
      // Add floating platforms
      if (level[y][x] === TileType.Empty && level[y-1] && level[y-1][x] === TileType.Empty) {
          if (rng.chance(0.01 + difficulty * 0.03)) {
              const platformLength = rng.nextInt(3, 6);
              for (let i = 0; i < platformLength && x + i < LEVEL_WIDTH; i++) {
                  level[y][x + i] = TileType.Ground;
              }
          }
      }
    }
  }
  
  // Place key weapons on early levels
  if (levelIndex === 1) level[LEVEL_HEIGHT - 4][10] = TileType.Sword;
  if (levelIndex === 3) level[LEVEL_HEIGHT - 6][15] = TileType.Axe;
  if (levelIndex === 4) level[LEVEL_HEIGHT - 5][20] = TileType.MorningStar;


  return level;
};