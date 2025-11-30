
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { PlayerControls } from '../hooks/usePlayerControls';
import { getLevel, getLevelName, TOTAL_LEVELS } from '../game/level';
import { updatePlayer, updateEnemies, updateProjectiles, checkInteractions, updateHazards } from '../game/engine';
import { 
    TILE_SIZE, GAME_WIDTH, GAME_HEIGHT, SCREEN_WIDTH, 
    PLAYER_ATTACK_DURATION, PLAYER_ATTACK_COOLDOWN, FIREBALL_SPEED, 
    PLAYER_MAX_HEALTH, SLIME_HEALTH, BAT_HEALTH, SPIKY_SLIME_HEALTH, SHOOTER_HEALTH, GHOST_HEALTH, LAVA_SLIME_HEALTH,
    EXTRA_LIFE_SCORE_THRESHOLD, MORNING_STAR_SPEED_X, MORNING_STAR_SPEED_Y, HEALTH_PACK_HEAL_AMOUNT, SHOOTER_ATTACK_COOLDOWN,
    INITIAL_PLAYER_LIVES, LEVEL_COMPLETE_SCORE_BONUS, FIREBALL_PICKUP_SCORE_BONUS,
    HORSE_BONUS_SCORE, HORSE_DURATION, CHEAT_CODE_SEQUENCE, CHEAT_CODE_SCORE_BONUS, BOMB_BONUS_SCORE,
    SLIME_SCORE, BAT_SCORE, SPIKY_SLIME_SCORE, SHOOTER_SCORE, GHOST_SCORE, LAVA_SLIME_SCORE,
    INVINCIBILITY_BONUS_SCORE, INVINCIBILITY_BONUS_DURATION,
} from '../constants';
import { Player as PlayerType, Enemy as EnemyTypeInterface, Projectile as ProjectileType, Hazard as HazardInterface, NPC as NPCType, GameStatus, TileType, EnemyType } from '../types';
import Player from './Player';
import EnemyComponent from './Enemy';
import Projectile from './Projectile';
import Item from './Item';
import Background from './Background';
import Hazard from './Hazard';
import NPC from './NPC';
import Cutscene, { EndingCutscene } from './Cutscene';
import DialogueBubble from './DialogueBubble';
import { playSound, resumeAudioContext, playMusic, stopMusic, MusicType } from '../game/audio';

const BOZO_PHRASES = [
    "For Elfioria!",
    "Let's do this!",
    "Adventure awaits!",
    "Where is she?",
    "Piece of cake!",
];

const BOZO_DAMAGE_PHRASES = [
    "Ouch!",
    "That hurt!",
    "Not good...",
    "Need health!",
    "Argh!",
];

// Modern Glass Modal
const DialogBox: React.FC<{children: React.ReactNode, title?: string}> = ({ children, title }) => (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-600 p-8 rounded-2xl shadow-2xl max-w-md mx-4 text-center relative animate-in fade-in zoom-in duration-300">
        {title && <h2 className="text-white text-2xl font-bold mb-4 uppercase tracking-wider drop-shadow-md font-pixel">{title}</h2>}
        <div className="flex flex-col items-center gap-4 text-slate-200 leading-relaxed font-medium">
            {children}
        </div>
    </div>
);

const MenuButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({ onClick, children }) => (
    <button 
        onClick={onClick} 
        className="mt-4 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold uppercase tracking-wide rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-emerald-500/30 font-pixel text-sm"
    >
        {children}
    </button>
);

const Heart: React.FC<{ full: boolean }> = ({ full }) => (
    <div className="relative w-4 h-4 transition-transform hover:scale-110">
       <svg viewBox="0 0 24 24" fill={full ? "#ef4444" : "#334155"} className="w-full h-full drop-shadow-sm">
         <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
       </svg>
    </div>
);

const HealthBar: React.FC<{ health: number; maxHealth: number }> = ({ health, maxHealth }) => (
  <div className="flex gap-1">
    {Array.from({ length: maxHealth }).map((_, i) => (
      <Heart key={i} full={i < health} />
    ))}
  </div>
);

// Helper function for music
const nameMatches = (name: string, keywords: string[]): boolean => {
    const lowerName = name.toLowerCase();
    return keywords.some(kw => lowerName.includes(kw.toLowerCase()));
};

const getMusicTypeForLevel = (levelIndex: number): MusicType => {
    if (levelIndex === TOTAL_LEVELS - 1) {
        return 'BOSS';
    }
    const levelName = getLevelName(levelIndex);
    if (nameMatches(levelName, ['Cavern', 'Mines', 'Abyss', 'Chasm', 'Depths', 'Gulch', 'Labyrinth', 'Trench', 'Sanctum', 'Vein', 'Core', 'Heart', 'Sunless'])) {
        return 'CAVE';
    }
    if (nameMatches(levelName, ['Castle', 'Citadel', 'Ramparts', 'Keep', 'Tower', 'Armory', 'Halls', 'Monastery', 'Vault', 'Ruins', 'Palace', 'Keep', 'Spire'])) {
        return 'CASTLE';
    }
    return 'FIELD';
};

interface GameProps {
    controls: PlayerControls;
}

const Game: React.FC<GameProps> = ({ controls }) => {
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [enemies, setEnemies] = useState<EnemyTypeInterface[]>([]);
  const [projectiles, setProjectiles] = useState<ProjectileType[]>([]);
  const [hazards, setHazards] = useState<HazardInterface[]>([]);
  const [npcs, setNpcs] = useState<NPCType[]>([]);
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);
  const [playerDialogue, setPlayerDialogue] = useState<string | null>(null);
  const [levelData, setLevelData] = useState<TileType[][] | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.StartScreen);
  const [screenFlash, setScreenFlash] = useState(0);
  const attackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const switchWeaponPressedRef = useRef(false);
  const [cheatSequence, setCheatSequence] = useState<string[]>([]);
  const prevControlsRef = useRef<PlayerControls>(controls);
  const dialogueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextDialogueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevHealthRef = useRef<number>();

  useEffect(() => {
    if (gameStatus === GameStatus.StartScreen) {
      playMusic('TITLE');
    } else if (gameStatus !== GameStatus.Playing && gameStatus !== GameStatus.Cutscene && gameStatus !== GameStatus.EndingCutscene) {
      stopMusic();
    }
  }, [gameStatus]);


  const playerHealth = player?.health;
  useEffect(() => {
    const clearTimeouts = () => {
        if (dialogueTimeoutRef.current) clearTimeout(dialogueTimeoutRef.current);
        if (nextDialogueTimeoutRef.current) clearTimeout(nextDialogueTimeoutRef.current);
    };

    let triggerRandomDialogue: () => void;
    const scheduleNextRandom = () => {
        clearTimeouts();
        const nextTime = Math.random() * 15000 + 15000;
        nextDialogueTimeoutRef.current = setTimeout(triggerRandomDialogue, nextTime);
    };

    triggerRandomDialogue = () => {
        const phrase = BOZO_PHRASES[Math.floor(Math.random() * BOZO_PHRASES.length)];
        setPlayerDialogue(phrase);
        
        dialogueTimeoutRef.current = setTimeout(() => {
            setPlayerDialogue(null);
        }, 3000);

        scheduleNextRandom();
    };
    
    if (gameStatus !== GameStatus.Playing) {
        clearTimeouts();
        setPlayerDialogue(null);
        return;
    }

    const previousHealth = prevHealthRef.current;
    if (previousHealth !== undefined && playerHealth !== undefined && playerHealth < previousHealth) {
        clearTimeouts();
        const phrase = BOZO_DAMAGE_PHRASES[Math.floor(Math.random() * BOZO_DAMAGE_PHRASES.length)];
        setPlayerDialogue(phrase);
        
        dialogueTimeoutRef.current = setTimeout(() => {
            setPlayerDialogue(null);
            scheduleNextRandom();
        }, 2000);
    } else if (!nextDialogueTimeoutRef.current && !dialogueTimeoutRef.current) {
        scheduleNextRandom();
    }

    if (playerHealth !== undefined) {
        prevHealthRef.current = playerHealth;
    }

    return clearTimeouts;
  }, [gameStatus, playerHealth]);


  const startGameForLevel = useCallback((levelIndex: number, existingPlayerState?: PlayerType) => {
    const isFullReset = !existingPlayerState || (existingPlayerState && existingPlayerState.lives <= 0);
    const isAdvancingLevel = existingPlayerState && levelIndex > currentLevelIndex;

    const currentLevelMap = getLevel(levelIndex).map(row => [...row]);
    let initialPlayer: PlayerType | null = null;
    const initialEnemies: EnemyTypeInterface[] = [];
    const initialNpcs: NPCType[] = [];

    currentLevelMap.forEach((row, y) => {
      row.forEach((tile, x) => {
        const pos = { x: x * TILE_SIZE, y: y * TILE_SIZE };
        if (tile === TileType.PlayerStart) {
          initialPlayer = {
            id: 'player',
            pos,
            size: { x: TILE_SIZE, y: TILE_SIZE },
            velocity: { x: 0, y: 0 },
            isGrounded: false,
            direction: 1,
            hasSword: isFullReset ? false : existingPlayerState?.hasSword ?? false, 
            hasAxe: isFullReset ? false : existingPlayerState?.hasAxe ?? false, 
            hasMorningStar: isFullReset ? false : existingPlayerState?.hasMorningStar ?? false, 
            currentWeapon: isFullReset ? 'sword' : existingPlayerState?.currentWeapon ?? 'sword',
            fireballAmmo: isFullReset ? 0 : existingPlayerState?.fireballAmmo ?? 0, 
            score: isFullReset ? 0 : existingPlayerState?.score ?? 0,
            lives: isFullReset ? INITIAL_PLAYER_LIVES : existingPlayerState?.lives ?? INITIAL_PLAYER_LIVES,
            nextLifeScore: isFullReset ? EXTRA_LIFE_SCORE_THRESHOLD : existingPlayerState?.nextLifeScore ?? EXTRA_LIFE_SCORE_THRESHOLD,
            health: isAdvancingLevel ? (existingPlayerState.health) : PLAYER_MAX_HEALTH,
            maxHealth: PLAYER_MAX_HEALTH,
            isAttacking: false, 
            attackCooldown: 0,
            invincibilityCooldown: 0,
            onHorse: false,
            horseCooldown: 0,
            horseBonusAwarded: isFullReset ? false : existingPlayerState?.horseBonusAwarded ?? false,
            bombBonusAwarded: isFullReset ? false : existingPlayerState?.bombBonusAwarded ?? false,
            invincibilityBonusCooldown: 0,
            invincibilityBonusAwarded: isFullReset ? false : existingPlayerState?.invincibilityBonusAwarded ?? false,
          };
        } else if (tile === TileType.NPC || tile === TileType.Princess) {
            let message = '';
            const type = tile === TileType.Princess ? 'princess' : 'standard';
            if (type === 'princess') {
                message = "My Hero! You saved the kingdom!";
            } else if (levelIndex === 0) {
                message = "Save the princess from the Sorcerer!";
            } else {
                message = "The princess is in another castle... just kidding, keep going!";
            }
            initialNpcs.push({
                id: `npc-${x}-${y}`, type, message, pos,
                size: { x: TILE_SIZE, y: TILE_SIZE },
                velocity: { x: 0, y: 0 },
            });
        }
        else if (tile >= TileType.EnemyStart) {
            let type: EnemyType | null = null;
            let health = 0;
            let attackCooldown: number | undefined = undefined;

            switch(tile) {
                case TileType.EnemyStart: type = EnemyType.Slime; health = SLIME_HEALTH; break;
                case TileType.BatStart: type = EnemyType.Bat; health = BAT_HEALTH; break;
                case TileType.SpikySlimeStart: type = EnemyType.SpikySlime; health = SPIKY_SLIME_HEALTH; break;
                case TileType.ShooterStart: type = EnemyType.Shooter; health = SHOOTER_HEALTH; attackCooldown = SHOOTER_ATTACK_COOLDOWN; break;
                case TileType.GhostStart: type = EnemyType.Ghost; health = GHOST_HEALTH; break;
                case TileType.LavaSlimeStart: type = EnemyType.LavaSlime; health = LAVA_SLIME_HEALTH; break;
            }

            if (type !== null) {
                initialEnemies.push({
                    id: `enemy-${x}-${y}`, pos, type, health, attackCooldown,
                    size: { x: TILE_SIZE, y: TILE_SIZE }, velocity: { x: 0, y: 0 },
                    initialPos: pos, direction: 1,
                });
            }
        }
      });
    });

    setPlayer(initialPlayer);
    setEnemies(initialEnemies);
    setNpcs(initialNpcs);
    setProjectiles([]);
    setHazards([]);
    setLevelData(currentLevelMap);
    setCurrentLevelIndex(levelIndex);
    setGameStatus(GameStatus.Playing);
    setActiveDialogue(null);

    const musicType = getMusicTypeForLevel(levelIndex);
    playMusic(musicType);
  }, [currentLevelIndex]);

  useEffect(() => {
    if (gameStatus === GameStatus.Playing && player && controls.attack && player.attackCooldown <= 0) {
      switch(player.currentWeapon) {
        case 'sword':
        case 'axe':
          if ( (player.currentWeapon === 'sword' && player.hasSword) || (player.currentWeapon === 'axe' && player.hasAxe)) {
            setPlayer(p => p ? { ...p, isAttacking: true, attackCooldown: PLAYER_ATTACK_COOLDOWN } : p);
            attackTimeoutRef.current = setTimeout(() => {
              setPlayer(p => p ? { ...p, isAttacking: false } : p);
            }, PLAYER_ATTACK_DURATION);
          }
          break;
        case 'fireball':
        case 'morning_star':
           if ( (player.currentWeapon === 'fireball' && player.fireballAmmo > 0) || (player.currentWeapon === 'morning_star' && player.hasMorningStar) ) {
                if (player.currentWeapon === 'fireball') {
                    setPlayer(p => p ? { ...p, fireballAmmo: p.fireballAmmo - 1, attackCooldown: PLAYER_ATTACK_COOLDOWN } : p);
                } else {
                    setPlayer(p => p ? { ...p, attackCooldown: PLAYER_ATTACK_COOLDOWN * 1.5 } : p);
                }

                setProjectiles(ps => [...ps, {
                    id: `proj-${Date.now()}`,
                    owner: 'player',
                    type: player.currentWeapon,
                    pos: { x: player.pos.x, y: player.pos.y + player.size.y / 4 },
                    size: { x: TILE_SIZE / 2, y: TILE_SIZE / 2 },
                    velocity: { 
                        x: (player.currentWeapon === 'morning_star' ? MORNING_STAR_SPEED_X : FIREBALL_SPEED) * player.direction, 
                        y: player.currentWeapon === 'morning_star' ? MORNING_STAR_SPEED_Y : 0 
                    },
                    direction: player.direction,
                }]);
           }
          break;
      }
    }
  }, [controls.attack, player, gameStatus]);
  
  useEffect(() => {
    if (player && controls.switchWeapon) {
        if (!switchWeaponPressedRef.current) {
            switchWeaponPressedRef.current = true;

            const weaponOrder: PlayerType['currentWeapon'][] = ['sword', 'axe', 'morning_star', 'fireball'];
            const ownedWeapons = weaponOrder.filter(w => {
                if (w === 'sword') return player.hasSword;
                if (w === 'axe') return player.hasAxe;
                if (w === 'morning_star') return player.hasMorningStar;
                if (w === 'fireball') return true;
                return false;
            });
            
            const canSwitch = ownedWeapons.length > 1 || (ownedWeapons.length > 0 && !ownedWeapons.includes(player.currentWeapon));

            if (canSwitch) {
                const currentIndex = ownedWeapons.indexOf(player.currentWeapon);
                const nextIndex = (currentIndex === -1) ? 0 : (currentIndex + 1) % ownedWeapons.length;
                const nextWeapon = ownedWeapons[nextIndex];
                setPlayer(p => p ? { ...p, currentWeapon: nextWeapon } : p);
            }
        }
    } else {
        switchWeaponPressedRef.current = false;
    }
  }, [controls.switchWeapon, player]);

  useEffect(() => {
    if (gameStatus !== GameStatus.Playing) {
        prevControlsRef.current = controls;
        return;
    }

    const prev = prevControlsRef.current;
    let action: string | null = null;

    if (controls.left && !prev.left) action = 'left';
    else if (controls.right && !prev.right) action = 'right';
    else if (controls.attack && !prev.attack) action = 'attack';
    else if (controls.jump && !prev.jump) action = 'jump';

    if (action) {
        setCheatSequence(currentSequence => {
            const newSequence = [...currentSequence, action].slice(-CHEAT_CODE_SEQUENCE.length);

            const isMatch = newSequence.length === CHEAT_CODE_SEQUENCE.length && 
                            newSequence.every((val, index) => val === CHEAT_CODE_SEQUENCE[index]);
            
            if (isMatch) {
                playSound('POWERUP');
                setPlayer(p => {
                    if (!p) return null;
                    const newScore = p.score + CHEAT_CODE_SCORE_BONUS;
                    let newLives = p.lives;
                    let newNextLifeScore = p.nextLifeScore;
                    while(newScore >= newNextLifeScore) {
                        newLives++;
                        newNextLifeScore += EXTRA_LIFE_SCORE_THRESHOLD;
                    }
                    return { ...p, score: newScore, lives: newLives, nextLifeScore: newNextLifeScore };
                });
                return [];
            }
            return newSequence;
        });
    }

    prevControlsRef.current = controls;

  }, [controls, gameStatus]);

  const gameTick = useCallback((deltaTime: number) => {
    if (gameStatus !== GameStatus.Playing || !player || !levelData) return;

    if (screenFlash > 0) {
        setScreenFlash(s => Math.max(0, s - deltaTime));
    }

    if (controls.jump && player.isGrounded) {
      playSound('JUMP');
    }

    let updatedPlayer = updatePlayer(player, controls, levelData, deltaTime);
    const { updatedEnemies, newProjectiles: enemyProjectiles } = updateEnemies(enemies, updatedPlayer, levelData, deltaTime);
    let updatedProjectiles = updateProjectiles([...projectiles, ...enemyProjectiles], levelData);
    let updatedHazards = updateHazards(hazards, deltaTime);
    
    let interactions = checkInteractions(updatedPlayer, updatedEnemies, updatedProjectiles, updatedHazards);
    updatedPlayer = interactions.newPlayer;
    updatedProjectiles = interactions.newProjectiles;
    
    if (interactions.defeatedEnemiesCount > 0) {
      playSound('ENEMY_DEATH');
    }

    if (interactions.newHazards.length > 0) {
        updatedHazards = [...updatedHazards, ...interactions.newHazards];
    }
    
    if (interactions.scoreGained > 0) {
        updatedPlayer.score += interactions.scoreGained;
        while (updatedPlayer.score >= updatedPlayer.nextLifeScore) {
            updatedPlayer.lives += 1;
            updatedPlayer.nextLifeScore += EXTRA_LIFE_SCORE_THRESHOLD;
        }
    }

    if (updatedPlayer.score >= HORSE_BONUS_SCORE && !updatedPlayer.horseBonusAwarded) {
        updatedPlayer.onHorse = true;
        updatedPlayer.horseCooldown = HORSE_DURATION;
        updatedPlayer.horseBonusAwarded = true;
        playSound('POWERUP');
    }

    if (updatedPlayer.onHorse) {
        updatedPlayer.horseCooldown -= deltaTime;
        if (updatedPlayer.horseCooldown <= 0) {
            updatedPlayer.onHorse = false;
            updatedPlayer.horseCooldown = 0;
            playSound('POWERDOWN');
        }
    }

    let levelWon = false;

    const playerTileX = Math.floor((updatedPlayer.pos.x + updatedPlayer.size.x / 2) / TILE_SIZE);
    const playerTileY = Math.floor((updatedPlayer.pos.y + updatedPlayer.size.y / 2) / TILE_SIZE);
    
    if (levelData[playerTileY] && levelData[playerTileY][playerTileX]) {
        const collectedTile = levelData[playerTileY][playerTileX];
        const isItem = [TileType.Sword, TileType.Fireball, TileType.Goal, TileType.Axe, TileType.MorningStar, TileType.HealthPack].includes(collectedTile);
        if (isItem) {
            const newLevelData = [...levelData];
            newLevelData[playerTileY] = [...newLevelData[playerTileY]];
            newLevelData[playerTileY][playerTileX] = TileType.Empty;
            setLevelData(newLevelData);

            if(collectedTile === TileType.Sword) { updatedPlayer.hasSword = true; updatedPlayer.currentWeapon = 'sword'; playSound('WEAPON_PICKUP'); }
            if(collectedTile === TileType.Axe) { updatedPlayer.hasAxe = true; updatedPlayer.currentWeapon = 'axe'; playSound('WEAPON_PICKUP'); }
            if(collectedTile === TileType.MorningStar) { updatedPlayer.hasMorningStar = true; updatedPlayer.currentWeapon = 'morning_star'; playSound('WEAPON_PICKUP'); }
            if(collectedTile === TileType.Fireball) {
                updatedPlayer.fireballAmmo += 5;
                updatedPlayer.score += FIREBALL_PICKUP_SCORE_BONUS;
                while (updatedPlayer.score >= updatedPlayer.nextLifeScore) {
                    updatedPlayer.lives += 1;
                    updatedPlayer.nextLifeScore += EXTRA_LIFE_SCORE_THRESHOLD;
                }
            }
            if(collectedTile === TileType.HealthPack) updatedPlayer.health = Math.min(updatedPlayer.health + HEALTH_PACK_HEAL_AMOUNT, updatedPlayer.maxHealth);
            if(collectedTile === TileType.Goal) levelWon = true;
        }
    }
    
    if (updatedPlayer.score >= BOMB_BONUS_SCORE && !updatedPlayer.bombBonusAwarded) {
        updatedPlayer.bombBonusAwarded = true;
        playSound('BOMB_EXPLOSION');
        setScreenFlash(250);

        let bombScoreBonus = 0;
        interactions.newEnemies.forEach(enemy => {
             switch(enemy.type) {
                case EnemyType.Slime: bombScoreBonus += SLIME_SCORE; break;
                case EnemyType.Bat: bombScoreBonus += BAT_SCORE; break;
                case EnemyType.SpikySlime: bombScoreBonus += SPIKY_SLIME_SCORE; break;
                case EnemyType.Shooter: bombScoreBonus += SHOOTER_SCORE; break;
                case EnemyType.Ghost: bombScoreBonus += GHOST_SCORE; break;
                case EnemyType.LavaSlime: bombScoreBonus += LAVA_SLIME_SCORE; break;
            }
        });
        
        if (bombScoreBonus > 0) {
            updatedPlayer.score += bombScoreBonus;
             while (updatedPlayer.score >= updatedPlayer.nextLifeScore) {
                updatedPlayer.lives += 1;
                updatedPlayer.nextLifeScore += EXTRA_LIFE_SCORE_THRESHOLD;
            }
        }
        
        interactions.newEnemies = [];
    }
    
    if (updatedPlayer.score >= INVINCIBILITY_BONUS_SCORE && !updatedPlayer.invincibilityBonusAwarded) {
        updatedPlayer.invincibilityBonusAwarded = true;
        updatedPlayer.invincibilityBonusCooldown = INVINCIBILITY_BONUS_DURATION;
        playSound('POWERUP');
    }

    if (updatedPlayer.invincibilityBonusCooldown > 0) {
        updatedPlayer.invincibilityBonusCooldown -= deltaTime;
        if (updatedPlayer.invincibilityBonusCooldown <= 0) {
            updatedPlayer.invincibilityBonusCooldown = 0;
            playSound('POWERDOWN');
        }
    }


    if (npcs.length > 0) {
        let closestNpcInRange: NPCType | null = null;
        let minDistance = TILE_SIZE * 2.5;

        const playerCenterX = updatedPlayer.pos.x + updatedPlayer.size.x / 2;
        const playerCenterY = updatedPlayer.pos.y + updatedPlayer.size.y / 2;

        for (const npc of npcs) {
            const npcCenterX = npc.pos.x + npc.size.x / 2;
            const npcCenterY = npc.pos.y + npc.size.y / 2;
            const distance = Math.sqrt(Math.pow(playerCenterX - npcCenterX, 2) + Math.pow(playerCenterY - npcCenterY, 2));

            if (distance < minDistance) {
                minDistance = distance;
                closestNpcInRange = npc;
            }
        }
        
        if (closestNpcInRange) {
            if (activeDialogue !== closestNpcInRange.message) {
                setActiveDialogue(closestNpcInRange.message);
                if (closestNpcInRange.type === 'princess') {
                    levelWon = true; 
                }
            }
        } else {
            setActiveDialogue(null);
        }
    }


    setEnemies(interactions.newEnemies);
    setProjectiles(updatedProjectiles);
    setHazards(updatedHazards);

    if (updatedPlayer.health <= 0 || updatedPlayer.pos.y > GAME_HEIGHT) {
        playSound('PLAYER_DEATH');
        updatedPlayer.lives -= 1;
        if (updatedPlayer.lives > 0) {
            setGameStatus(GameStatus.Died);
        } else {
            setGameStatus(GameStatus.Lost);
        }
    } else if (levelWon) {
        updatedPlayer.score += LEVEL_COMPLETE_SCORE_BONUS;
        while (updatedPlayer.score >= updatedPlayer.nextLifeScore) {
            updatedPlayer.lives += 1;
            updatedPlayer.nextLifeScore += EXTRA_LIFE_SCORE_THRESHOLD;
        }
        
        if (currentLevelIndex < TOTAL_LEVELS - 1) {
            setGameStatus(GameStatus.LevelComplete);
        } else {
            // Go to Ending Cutscene instead of straight to Won
            setGameStatus(GameStatus.EndingCutscene);
        }
    }
    
    setPlayer(updatedPlayer);

  }, [gameStatus, player, controls, enemies, projectiles, hazards, levelData, currentLevelIndex, npcs, activeDialogue, startGameForLevel, screenFlash]);

  useGameLoop(gameTick);

  const renderGameScreen = () => {
    let content;
    const cameraX = player ? Math.max(0, Math.min(player.pos.x - SCREEN_WIDTH / 2, GAME_WIDTH - SCREEN_WIDTH)) : 0;
    
    switch(gameStatus) {
        case GameStatus.StartScreen:
            content = (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                    <DialogBox>
                         <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-700 mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider text-center" style={{fontFamily: "'Cinzel', serif"}}>
                            BOZO THE ELF
                         </h1>
                         <MenuButton onClick={() => { resumeAudioContext(); setGameStatus(GameStatus.Cutscene); }}>START ADVENTURE</MenuButton>
                    </DialogBox>
                </div>
            );
            break;
        case GameStatus.Cutscene:
            content = <Cutscene onFinished={() => startGameForLevel(0)} />;
            break;
        case GameStatus.EndingCutscene:
            content = <EndingCutscene onFinished={() => setGameStatus(GameStatus.Won)} />;
            break;
        case GameStatus.LevelComplete:
            content = (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                     <DialogBox title="Level Complete">
                        <p className="text-emerald-400 font-bold text-xl mb-4">{getLevelName(currentLevelIndex)}</p>
                        <div className="bg-slate-800 p-4 rounded-lg mb-4 border border-slate-700">
                            <p className="text-slate-400 text-xs">SCORE BONUS</p>
                            <p className="text-white font-mono text-lg">+{LEVEL_COMPLETE_SCORE_BONUS}</p>
                        </div>
                        <MenuButton onClick={() => startGameForLevel(currentLevelIndex + 1, player ?? undefined)}>CONTINUE</MenuButton>
                    </DialogBox>
                </div>
            );
            break;
        case GameStatus.Won:
            content = (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-sm">
                     <DialogBox title="VICTORY!">
                        <p className="mb-4 text-lg text-yellow-300">{activeDialogue || "You rescued the princess!"}</p>
                         <div className="bg-slate-800 p-4 rounded-lg mb-4 border border-slate-700 w-full">
                            <p className="text-slate-400 text-xs uppercase">Final Score</p>
                            <p className="text-white font-mono text-2xl text-yellow-400">{player?.score}</p>
                        </div>
                        <MenuButton onClick={() => startGameForLevel(0)}>PLAY AGAIN</MenuButton>
                    </DialogBox>
                </div>
            );
            break;
        case GameStatus.Died:
             content = (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-red-900/20 backdrop-blur-sm">
                    <DialogBox title="You Died">
                        <div className="mb-4">
                             <p className="text-slate-300">Lives Remaining: <span className="text-white font-bold">{player?.lives}</span></p>
                        </div>
                        <MenuButton onClick={() => startGameForLevel(currentLevelIndex, player ?? undefined)}>TRY AGAIN</MenuButton>
                    </DialogBox>
                </div>
            );
            break;
        case GameStatus.Lost:
             content = (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
                     <DialogBox title="Game Over">
                        <p className="text-slate-400 mb-4">Your journey ends here.</p>
                        <MenuButton onClick={() => startGameForLevel(0)}>RESTART</MenuButton>
                     </DialogBox>
                </div>
            );
            break;
        case GameStatus.Playing:
            if (!player || !levelData) return null;
            content = (
              <>
                <div className="absolute inset-0" style={{ transform: `translateX(-${cameraX}px)` }}>
                    {levelData.map((row, y) =>
                        row.map((tile, x) => {
                            if (tile === TileType.Empty) return null;
                            const style = { left: x * TILE_SIZE, top: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE };
                            if (tile === TileType.Ground) {
                                return (
                                    <div key={`${x}-${y}`} className="absolute" style={style}>
                                        <div className="w-full h-full bg-slate-800 rounded-sm relative overflow-hidden">
                                            {/* Grass Top */}
                                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600/80"></div>
                                            {/* Texture */}
                                            <div className="absolute top-2 left-1 w-1 h-1 bg-slate-700 rounded-full opacity-50"></div>
                                            <div className="absolute bottom-2 right-2 w-2 h-2 bg-slate-700 rounded-full opacity-50"></div>
                                        </div>
                                    </div>
                                );
                            }
                            if ([TileType.Goal, TileType.Sword, TileType.Fireball, TileType.Spike, TileType.Axe, TileType.MorningStar, TileType.HealthPack].includes(tile)) {
                                return <Item key={`${x}-${y}`} type={tile} style={style} />;
                            }
                            return null;
                        })
                    )}
                    {player && <Player player={player} />}
                    {enemies.map(enemy => <EnemyComponent key={enemy.id} enemy={enemy} />)}
                    {projectiles.map(p => <Projectile key={p.id} projectile={p} />)}
                    {hazards.map(h => <Hazard key={h.id} hazard={h} />)}
                    {npcs.map(npc => <NPC key={npc.id} npc={npc} />)}
                     {playerDialogue && player && (
                        <DialogueBubble 
                            text={playerDialogue} 
                            player={player}
                        />
                    )}
                </div>
                 {activeDialogue && (
                    <div className="absolute bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-slate-900/90 text-white p-6 rounded-xl border border-slate-700 shadow-2xl z-30 text-center animate-in slide-in-from-bottom-4 fade-in duration-300">
                        <p className="text-sm sm:text-base font-medium leading-relaxed">{activeDialogue}</p>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rotate-45 border-b border-r border-slate-700"></div>
                    </div>
                )}
              </>
            );
            break;
    }
    return (
        <div className="w-full h-full relative overflow-hidden select-none">
            {screenFlash > 0 && (
                <div className="absolute inset-0 bg-white z-50 mix-blend-overlay" style={{ opacity: screenFlash / 250 }}></div>
            )}
            <Background cameraX={cameraX} levelIndex={currentLevelIndex} />
            {content}
        </div>
    );
  }

  const WeaponIcon = () => {
    if (!player) return null;
    const props = { type: TileType.Sword, style: {width: 16, height: 16, position: 'relative'}};
    switch (player.currentWeapon) {
        case 'axe': props.type = TileType.Axe; break;
        case 'morning_star': props.type = TileType.MorningStar; break;
        case 'fireball': props.type = TileType.Fireball; break;
        default: props.type = TileType.Sword; break;
    }
    return <Item {...props} />
  }

  return (
    <div className="w-full h-full relative font-sans">
         {player && gameStatus === GameStatus.Playing &&
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
              {/* Top Left HUD */}
              <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-500">
                   {/* Health & Lives */}
                  <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-700/50 shadow-sm">
                    <HealthBar health={player.health} maxHealth={player.maxHealth} />
                    <div className="h-4 w-px bg-slate-600"></div>
                    <span className="text-xs font-bold text-white tracking-wide">x{player.lives}</span>
                  </div>
                  
                   {/* Weapon */}
                  <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-700/50 shadow-sm w-fit">
                     <WeaponIcon />
                     <span className="text-xs font-bold text-emerald-400">{player.currentWeapon === 'fireball' ? player.fireballAmmo : '∞'}</span>
                  </div>
              </div>

              {/* Top Right HUD */}
              <div className="flex flex-col items-end gap-1 animate-in slide-in-from-top-2 fade-in duration-500 delay-100">
                <div className="bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50 text-right shadow-sm">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score</div>
                    <div className="font-mono text-lg text-white leading-none">{player.score.toString().padStart(6, '0')}</div>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-slate-300 font-medium">
                    {getLevelName(currentLevelIndex)}
                </div>
              </div>
            </div>
         }
        {renderGameScreen()}
    </div>
  );
};

export default Game;
