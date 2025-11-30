import { TileType } from '../types';
import { generateLevel } from './level-generator';
import { levelNames } from './level-names';

export const TOTAL_LEVELS = 50;

const levelCache: { [key: number]: TileType[][] } = {};

export const getLevelName = (levelIndex: number): string => {
    return levelNames[levelIndex] || `The Lost Realm ${levelIndex + 1}`;
}

export const getLevel = (levelIndex: number): TileType[][] => {
    if (levelCache[levelIndex]) {
        return levelCache[levelIndex];
    }
    
    if (levelIndex >= TOTAL_LEVELS) {
        // Fallback for safety, though UI should prevent this
        const emptyLevel = Array.from({ length: 15 }, () => Array(100).fill(TileType.Empty));
        emptyLevel[13] = Array(100).fill(TileType.Ground);
        return emptyLevel;
    }

    const newLevel = generateLevel(levelIndex);
    levelCache[levelIndex] = newLevel;
    return newLevel;
}
