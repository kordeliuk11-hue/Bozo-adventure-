export const TILE_SIZE = 16;
export const LEVEL_WIDTH = 100; // in tiles
export const LEVEL_HEIGHT = 15; // in tiles

export const GRAVITY = 0.3;
export const MAX_FALL_SPEED = 6;

export const PLAYER_SPEED = 2;
export const PLAYER_JUMP_STRENGTH = -6.5;

export const ENEMY_SPEED = 0.5;
export const BAT_SPEED = 0.7;
export const GHOST_SPEED = 0.4;
export const PLAYER_STOMP_BOUNCE = -4;

export const FIREBALL_SPEED = 4;
export const MORNING_STAR_SPEED_X = 2.5;
export const MORNING_STAR_SPEED_Y = -4;
export const ENEMY_PROJECTILE_SPEED = 3;


export const PLAYER_ATTACK_DURATION = 150; // ms for sword swing
export const PLAYER_ATTACK_COOLDOWN = 300; // ms between attacks
export const PLAYER_ATTACK_RANGE = 18; // pixels

export const GAME_WIDTH = LEVEL_WIDTH * TILE_SIZE;
export const GAME_HEIGHT = LEVEL_HEIGHT * TILE_SIZE;
export const SCREEN_WIDTH = 26 * TILE_SIZE; // The visible area width

// Health and Damage constants
export const PLAYER_MAX_HEALTH = 3;
export const PLAYER_INVINCIBILITY_DURATION = 1000; // ms
export const HEALTH_PACK_HEAL_AMOUNT = 1;

export const SLIME_HEALTH = 1;
export const BAT_HEALTH = 1;
export const SPIKY_SLIME_HEALTH = 2;
export const SHOOTER_HEALTH = 2;
export const GHOST_HEALTH = 2;
export const LAVA_SLIME_HEALTH = 1;

export const PLAYER_SWORD_DAMAGE = 1;
export const PLAYER_AXE_DAMAGE = 2;
export const PLAYER_FIREBALL_DAMAGE = 1;
export const PLAYER_MORNING_STAR_DAMAGE = 2;
export const ENEMY_CONTACT_DAMAGE = 1;
export const ENEMY_PROJECTILE_DAMAGE = 1;
export const SPIKE_DAMAGE = 1;
export const LAVA_POOL_DAMAGE = 1;
export const LAVA_POOL_DURATION = 2000; // ms


// Scoring
export const SLIME_SCORE = 100;
export const BAT_SCORE = 150;
export const SPIKY_SLIME_SCORE = 250;
export const SHOOTER_SCORE = 300;
export const GHOST_SCORE = 350;
export const LAVA_SLIME_SCORE = 200;
export const INITIAL_PLAYER_LIVES = 3;
export const EXTRA_LIFE_SCORE_THRESHOLD = 2000;
export const LEVEL_COMPLETE_SCORE_BONUS = 400;
export const FIREBALL_PICKUP_SCORE_BONUS = 100;

// Horse Power-up
export const HORSE_BONUS_SCORE = 5000;
export const HORSE_DURATION = 5000; // ms
export const HORSE_SPEED = 4;
export const HORSE_JUMP_STRENGTH = -7.5;

// Bomb Power-up
export const BOMB_BONUS_SCORE = 10000;

// Invincibility Power-up
export const INVINCIBILITY_BONUS_SCORE = 20000;
export const INVINCIBILITY_BONUS_DURATION = 10000; // ms

// Cheat Code
export const CHEAT_CODE_SEQUENCE = ['left', 'right', 'left', 'right', 'attack', 'jump'];
export const CHEAT_CODE_SCORE_BONUS = 4500;

// Enemy AI
export const SHOOTER_ATTACK_RANGE = TILE_SIZE * 8; // 8 tiles
export const SHOOTER_ATTACK_COOLDOWN = 2000; // ms
export const GHOST_AGGRO_RANGE = TILE_SIZE * 7;