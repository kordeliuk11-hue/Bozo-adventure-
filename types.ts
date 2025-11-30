
export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  pos: Vector2D;
  size: Vector2D;
  velocity: Vector2D;
}

export interface Player extends GameObject {
  isGrounded: boolean;
  health: number;
  maxHealth: number;
  invincibilityCooldown: number;
  direction: 1 | -1;
  hasSword: boolean;
  hasAxe: boolean;
  hasMorningStar: boolean;
  currentWeapon: 'sword' | 'fireball' | 'axe' | 'morning_star';
  fireballAmmo: number;
  isAttacking: boolean;
  attackCooldown: number;
  score: number;
  lives: number;
  nextLifeScore: number;
  onHorse: boolean;
  horseCooldown: number;
  horseBonusAwarded: boolean;
  bombBonusAwarded: boolean;
  invincibilityBonusCooldown: number;
  invincibilityBonusAwarded: boolean;
}

export enum EnemyType {
  Slime,
  Bat,
  SpikySlime,
  Shooter,
  Ghost,
  LavaSlime,
}

export interface Enemy extends GameObject {
  type: EnemyType;
  initialPos: Vector2D;
  direction: 1 | -1;
  health: number;
  attackCooldown?: number;
}

export interface Projectile extends GameObject {
    direction: 1 | -1;
    type: 'fireball' | 'morning_star' | 'enemy_bullet';
    owner: 'player' | 'enemy';
}

export enum HazardType {
    Lava,
}

export interface Hazard extends GameObject {
    type: HazardType;
    duration: number;
}

export interface NPC extends GameObject {
  type: 'standard' | 'princess';
  message: string;
}


export enum GameStatus {
  StartScreen,
  Cutscene,
  EndingCutscene,
  Playing,
  LevelComplete,
  Won,
  Lost,
  Died,
}

export enum TileType {
  Empty = 0,
  Ground = 1,
  PlayerStart = 2,
  EnemyStart = 3, // Slime
  Goal = 4,
  Sword = 5,
  Fireball = 6,
  BatStart = 7,
  SpikySlimeStart = 8,
  Spike = 9,
  Axe = 10,
  MorningStar = 11,
  HealthPack = 12,
  ShooterStart = 13,
  GhostStart = 14,
  LavaSlimeStart = 15,
  NPC = 16,
  Princess = 17,
}
