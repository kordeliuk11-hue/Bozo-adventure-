import { Player, Enemy, Projectile, Vector2D, TileType, EnemyType, Hazard, HazardType } from '../types';
import {
  GRAVITY,
  MAX_FALL_SPEED,
  PLAYER_SPEED,
  PLAYER_JUMP_STRENGTH,
  ENEMY_SPEED,
  BAT_SPEED,
  GHOST_SPEED,
  PLAYER_STOMP_BOUNCE,
  TILE_SIZE,
  PLAYER_ATTACK_RANGE,
  PLAYER_INVINCIBILITY_DURATION,
  SPIKE_DAMAGE,
  ENEMY_CONTACT_DAMAGE,
  PLAYER_SWORD_DAMAGE,
  PLAYER_FIREBALL_DAMAGE,
  PLAYER_AXE_DAMAGE,
  PLAYER_MORNING_STAR_DAMAGE,
  SLIME_SCORE,
  BAT_SCORE,
  SPIKY_SLIME_SCORE,
  SHOOTER_SCORE,
  GHOST_SCORE,
  LAVA_SLIME_SCORE,
  SHOOTER_ATTACK_RANGE,
  SHOOTER_ATTACK_COOLDOWN,
  ENEMY_PROJECTILE_SPEED,
  ENEMY_PROJECTILE_DAMAGE,
  GHOST_AGGRO_RANGE,
  LAVA_POOL_DURATION,
  LAVA_POOL_DAMAGE,
  HORSE_SPEED,
  HORSE_JUMP_STRENGTH,
} from '../constants';

const isColliding = (objA: { pos: Vector2D; size: Vector2D }, objB: { pos: Vector2D; size: Vector2D }) => {
  return (
    objA.pos.x < objB.pos.x + objB.size.x &&
    objA.pos.x + objA.size.x > objB.pos.x &&
    objA.pos.y < objB.pos.y + objB.size.y &&
    objA.pos.y + objA.size.y > objB.pos.y
  );
};

const getTileAt = (x: number, y: number, levelData: TileType[][]): TileType => {
  const tileX = Math.floor(x / TILE_SIZE);
  const tileY = Math.floor(y / TILE_SIZE);
  if (levelData[tileY] && levelData[tileY][tileX] !== undefined) {
    return levelData[tileY][tileX];
  }
  return TileType.Empty;
};

export const updatePlayer = (player: Player, controls: { left: boolean; right: boolean; jump: boolean }, levelData: TileType[][], deltaTime: number): Player => {
  const newPlayer = { ...player, pos: { ...player.pos }, velocity: { ...player.velocity } };

  // Update cooldowns
  if (newPlayer.attackCooldown > 0) newPlayer.attackCooldown -= deltaTime;
  if (newPlayer.invincibilityCooldown > 0) newPlayer.invincibilityCooldown -= deltaTime;
  
  const speed = newPlayer.onHorse ? HORSE_SPEED : PLAYER_SPEED;
  const jumpStrength = newPlayer.onHorse ? HORSE_JUMP_STRENGTH : PLAYER_JUMP_STRENGTH;

  // Horizontal Movement
  if (controls.left) {
    newPlayer.velocity.x = -speed;
    newPlayer.direction = -1;
  } else if (controls.right) {
    newPlayer.velocity.x = speed;
    newPlayer.direction = 1;
  } else {
    newPlayer.velocity.x = 0;
  }
  newPlayer.pos.x += newPlayer.velocity.x;

  // Horizontal Collision
  if (newPlayer.velocity.x < 0) { // Moving left
    if (getTileAt(newPlayer.pos.x, newPlayer.pos.y, levelData) === TileType.Ground || getTileAt(newPlayer.pos.x, newPlayer.pos.y + newPlayer.size.y - 1, levelData) === TileType.Ground) {
      newPlayer.pos.x = Math.floor(newPlayer.pos.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE;
    }
  } else if (newPlayer.velocity.x > 0) { // Moving right
    if (getTileAt(newPlayer.pos.x + newPlayer.size.x, newPlayer.pos.y, levelData) === TileType.Ground || getTileAt(newPlayer.pos.x + newPlayer.size.x, newPlayer.pos.y + newPlayer.size.y - 1, levelData) === TileType.Ground) {
      newPlayer.pos.x = Math.floor((newPlayer.pos.x + newPlayer.size.x) / TILE_SIZE) * TILE_SIZE - newPlayer.size.x;
    }
  }
   if (newPlayer.pos.x < 0) newPlayer.pos.x = 0;


  // Vertical Movement & Gravity
  newPlayer.velocity.y += GRAVITY;
  if (newPlayer.velocity.y > MAX_FALL_SPEED) {
    newPlayer.velocity.y = MAX_FALL_SPEED;
  }

  // Jumping
  if (controls.jump && newPlayer.isGrounded) {
    newPlayer.velocity.y = jumpStrength;
    newPlayer.isGrounded = false;
  }

  newPlayer.pos.y += newPlayer.velocity.y;
  newPlayer.isGrounded = false;

  // Vertical Collision
  if (newPlayer.velocity.y > 0) { // Moving down
    if (getTileAt(newPlayer.pos.x, newPlayer.pos.y + newPlayer.size.y, levelData) === TileType.Ground || getTileAt(newPlayer.pos.x + newPlayer.size.x - 1, newPlayer.pos.y + newPlayer.size.y, levelData) === TileType.Ground) {
      newPlayer.pos.y = Math.floor((newPlayer.pos.y + newPlayer.size.y) / TILE_SIZE) * TILE_SIZE - newPlayer.size.y;
      newPlayer.velocity.y = 0;
      newPlayer.isGrounded = true;
    }
  } else if (newPlayer.velocity.y < 0) { // Moving up
    if (getTileAt(newPlayer.pos.x, newPlayer.pos.y, levelData) === TileType.Ground || getTileAt(newPlayer.pos.x + newPlayer.size.x - 1, newPlayer.pos.y, levelData) === TileType.Ground) {
      newPlayer.pos.y = Math.floor(newPlayer.pos.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE;
      newPlayer.velocity.y = 0;
    }
  }
  
  // Spike Collision
  if (newPlayer.invincibilityCooldown <= 0 && !newPlayer.onHorse && newPlayer.invincibilityBonusCooldown <= 0) {
      const playerBox = {
          left: newPlayer.pos.x, right: newPlayer.pos.x + newPlayer.size.x,
          top: newPlayer.pos.y, bottom: newPlayer.pos.y + newPlayer.size.y
      };
      if (getTileAt(playerBox.left, playerBox.bottom, levelData) === TileType.Spike || 
          getTileAt(playerBox.right-1, playerBox.bottom, levelData) === TileType.Spike ||
          getTileAt(playerBox.left, playerBox.top, levelData) === TileType.Spike ||
          getTileAt(playerBox.right-1, playerBox.top, levelData) === TileType.Spike) {
        newPlayer.health -= SPIKE_DAMAGE;
        newPlayer.invincibilityCooldown = PLAYER_INVINCIBILITY_DURATION;
      }
  }


  return newPlayer;
};

export const updateEnemies = (
  enemies: Enemy[],
  player: Player,
  levelData: TileType[][],
  deltaTime: number
): { updatedEnemies: Enemy[], newProjectiles: Projectile[] } => {
  const newProjectiles: Projectile[] = [];

  const updatedEnemies = enemies.map(enemy => {
    let newEnemy = { ...enemy, pos: { ...enemy.pos }, velocity: { ...enemy.velocity } };
    
    // Cooldown update for enemies that use it
    if (newEnemy.attackCooldown !== undefined && newEnemy.attackCooldown > 0) {
        newEnemy.attackCooldown -= deltaTime;
    }
    
    const dx = player.pos.x - newEnemy.pos.x;
    const dy = player.pos.y - newEnemy.pos.y;
    const distance = Math.sqrt(dx*dx + dy*dy);

    switch(newEnemy.type) {
        case EnemyType.Bat:
            newEnemy.velocity.y = BAT_SPEED * newEnemy.direction;
            newEnemy.pos.y += newEnemy.velocity.y;
            if (getTileAt(newEnemy.pos.x, newEnemy.pos.y, levelData) === TileType.Ground || getTileAt(newEnemy.pos.x, newEnemy.pos.y + newEnemy.size.y, levelData) === TileType.Ground) {
                newEnemy.direction *= -1;
                newEnemy.pos.y += newEnemy.velocity.y * -2;
            }
            break;
        case EnemyType.Slime:
        case EnemyType.LavaSlime:
        case EnemyType.SpikySlime:
            newEnemy.velocity.x = ENEMY_SPEED * newEnemy.direction;
            newEnemy.pos.x += newEnemy.velocity.x;
            
            const frontTileX = newEnemy.direction === 1 ? newEnemy.pos.x + newEnemy.size.x : newEnemy.pos.x;
            const frontGroundTileY = newEnemy.pos.y + newEnemy.size.y + 1;

            if (getTileAt(frontTileX, newEnemy.pos.y, levelData) === TileType.Ground || getTileAt(frontTileX, frontGroundTileY, levelData) === TileType.Empty) {
                newEnemy.direction *= -1;
                newEnemy.pos.x -= newEnemy.velocity.x * 2;
            }
            
            newEnemy.velocity.y += GRAVITY;
            if (newEnemy.velocity.y > MAX_FALL_SPEED) newEnemy.velocity.y = MAX_FALL_SPEED;
            newEnemy.pos.y += newEnemy.velocity.y;

            if (getTileAt(newEnemy.pos.x, newEnemy.pos.y + newEnemy.size.y, levelData) === TileType.Ground || getTileAt(newEnemy.pos.x + newEnemy.size.x - 1, newEnemy.pos.y + newEnemy.size.y, levelData) === TileType.Ground) {
              newEnemy.pos.y = Math.floor((newEnemy.pos.y + newEnemy.size.y) / TILE_SIZE) * TILE_SIZE - newEnemy.size.y;
              newEnemy.velocity.y = 0;
            }
            break;
        case EnemyType.Shooter:
            // Stationary, but applies gravity to land on ground
            newEnemy.velocity.y += GRAVITY;
            if (newEnemy.velocity.y > MAX_FALL_SPEED) newEnemy.velocity.y = MAX_FALL_SPEED;
            newEnemy.pos.y += newEnemy.velocity.y;

             if (getTileAt(newEnemy.pos.x, newEnemy.pos.y + newEnemy.size.y, levelData) === TileType.Ground || getTileAt(newEnemy.pos.x + newEnemy.size.x - 1, newEnemy.pos.y + newEnemy.size.y, levelData) === TileType.Ground) {
              newEnemy.pos.y = Math.floor((newEnemy.pos.y + newEnemy.size.y) / TILE_SIZE) * TILE_SIZE - newEnemy.size.y;
              newEnemy.velocity.y = 0;
            }

            // Shooting logic
            if (distance < SHOOTER_ATTACK_RANGE && newEnemy.attackCooldown <= 0) {
                newEnemy.attackCooldown = SHOOTER_ATTACK_COOLDOWN;
                const angle = Math.atan2(dy, dx);
                newProjectiles.push({
                    id: `eproj-${Date.now()}-${Math.random()}`,
                    owner: 'enemy',
                    type: 'enemy_bullet',
                    pos: { x: newEnemy.pos.x + newEnemy.size.x/4, y: newEnemy.pos.y + newEnemy.size.y/4 },
                    size: { x: TILE_SIZE/2, y: TILE_SIZE/2 },
                    velocity: { x: Math.cos(angle) * ENEMY_PROJECTILE_SPEED, y: Math.sin(angle) * ENEMY_PROJECTILE_SPEED },
                    direction: 1,
                });
            }

            break;
        case EnemyType.Ghost:
            // Ghost AI: slowly moves towards player if in range, ignores walls
            if (distance < GHOST_AGGRO_RANGE) {
                 const angle = Math.atan2(dy, dx);
                 newEnemy.velocity.x = Math.cos(angle) * GHOST_SPEED;
                 newEnemy.velocity.y = Math.sin(angle) * GHOST_SPEED;
            } else {
                newEnemy.velocity.x = 0;
                newEnemy.velocity.y = 0;
            }
            newEnemy.pos.x += newEnemy.velocity.x;
            newEnemy.pos.y += newEnemy.velocity.y;
            break;
    }
    return newEnemy;
  });
  return { updatedEnemies, newProjectiles };
};

export const updateProjectiles = (projectiles: Projectile[], levelData: TileType[][]): Projectile[] => {
    return projectiles.map(p => {
        const newProjectile = { ...p, pos: { ...p.pos }, velocity: { ...p.velocity } };
        if (newProjectile.type === 'morning_star') {
            newProjectile.velocity.y += GRAVITY / 2;
        }
        newProjectile.pos.x += newProjectile.velocity.x;
        newProjectile.pos.y += newProjectile.velocity.y;

        return newProjectile;
    }).filter(p => {
        const isOutOfBounds = p.pos.x < -100 || p.pos.x > (levelData[0].length * TILE_SIZE + 100) || p.pos.y < -100 || p.pos.y > (levelData.length * TILE_SIZE + 100);
        const isHittingWall = getTileAt(p.pos.x, p.pos.y, levelData) === TileType.Ground;
        return !isOutOfBounds && !isHittingWall;
    });
};

export const updateHazards = (hazards: Hazard[], deltaTime: number): Hazard[] => {
    return hazards.map(h => ({...h, duration: h.duration - deltaTime})).filter(h => h.duration > 0);
};


export const checkInteractions = (
  player: Player,
  enemies: Enemy[],
  projectiles: Projectile[],
  hazards: Hazard[]
): {
  newPlayer: Player;
  newEnemies: Enemy[];
  newProjectiles: Projectile[];
  newHazards: Hazard[];
  scoreGained: number;
  defeatedEnemiesCount: number;
} => {
  let newPlayer = { ...player };
  let newProjectiles = [...projectiles];
  let newHazards: Hazard[] = [];
  let scoreGained = 0;
  let defeatedEnemiesCount = 0;
  
  let mutableEnemies = enemies.map(e => ({ ...e }));

  // 1. HORSE LOGIC: If on horse, defeat enemies on contact.
  if (newPlayer.onHorse) {
      mutableEnemies.forEach(enemy => {
          if (enemy.health > 0 && isColliding(player, enemy)) {
              enemy.health = 0;
          }
      });
  }


  // 2. Check player melee attacks on enemies
  if (player.isAttacking && (player.currentWeapon === 'sword' || player.currentWeapon === 'axe')) {
    const swordHitbox = {
      pos: {
        x: player.direction > 0 ? player.pos.x + player.size.x : player.pos.x - PLAYER_ATTACK_RANGE,
        y: player.pos.y,
      },
      size: { x: PLAYER_ATTACK_RANGE, y: player.size.y },
    };
    const damage = player.currentWeapon === 'axe' ? PLAYER_AXE_DAMAGE : PLAYER_SWORD_DAMAGE;
    mutableEnemies.forEach(enemy => {
      if (enemy.health > 0 && isColliding(swordHitbox, enemy)) {
        enemy.health -= damage;
      }
    });
  }

  // 3. Check projectile collisions
  newProjectiles = newProjectiles.filter(projectile => {
    let projectileHit = false;
    // Player projectiles hitting enemies
    if (projectile.owner === 'player') {
        const damage = projectile.type === 'morning_star' ? PLAYER_MORNING_STAR_DAMAGE : PLAYER_FIREBALL_DAMAGE;
        mutableEnemies.forEach(enemy => {
            if (enemy.health > 0 && isColliding(projectile, enemy)) {
                enemy.health -= damage;
                projectileHit = true;
            }
        });
    }
    // Enemy projectiles hitting player
    else if (projectile.owner === 'enemy') {
        if (!newPlayer.onHorse && newPlayer.invincibilityCooldown <= 0 && newPlayer.invincibilityBonusCooldown <= 0 && isColliding(projectile, newPlayer)) {
            newPlayer.health -= ENEMY_PROJECTILE_DAMAGE;
            newPlayer.invincibilityCooldown = PLAYER_INVINCIBILITY_DURATION;
            projectileHit = true;
        }
    }
    return !projectileHit;
  });

  // 4. Check player-enemy contact collisions
  const canTakeContactDamage = !newPlayer.onHorse && newPlayer.invincibilityCooldown <= 0 && newPlayer.invincibilityBonusCooldown <= 0;
  if (canTakeContactDamage) {
    mutableEnemies.forEach(enemy => {
      if (enemy.health > 0 && isColliding(player, enemy)) {
        const isStomping = player.velocity.y > 0 && player.pos.y + player.size.y < enemy.pos.y + enemy.size.y / 2;
        
        if (isStomping) {
          if (enemy.type === EnemyType.SpikySlime || enemy.type === EnemyType.Shooter) {
            newPlayer.health -= ENEMY_CONTACT_DAMAGE;
            newPlayer.invincibilityCooldown = PLAYER_INVINCIBILITY_DURATION;
            newPlayer.velocity.y = PLAYER_STOMP_BOUNCE;
          } else {
            enemy.health -= 1;
            newPlayer.velocity.y = PLAYER_STOMP_BOUNCE;
          }
        } else {
          newPlayer.health -= ENEMY_CONTACT_DAMAGE;
          newPlayer.invincibilityCooldown = PLAYER_INVINCIBILITY_DURATION;
        }
      }
    });
  }
  
  // 5. Check player-hazard collisions
  if (!newPlayer.onHorse && newPlayer.invincibilityCooldown <= 0 && newPlayer.invincibilityBonusCooldown <= 0) {
      hazards.forEach(hazard => {
          if (isColliding(player, hazard)) {
              if (hazard.type === HazardType.Lava) {
                  newPlayer.health -= LAVA_POOL_DAMAGE;
                  newPlayer.invincibilityCooldown = PLAYER_INVINCIBILITY_DURATION;
              }
          }
      });
  }


  // 6. Filter out defeated enemies and add score / spawn hazards
  const newEnemies = mutableEnemies.filter(enemy => {
    if (enemy.health <= 0) {
        defeatedEnemiesCount++;
        switch(enemy.type) {
            case EnemyType.Slime: scoreGained += SLIME_SCORE; break;
            case EnemyType.Bat: scoreGained += BAT_SCORE; break;
            case EnemyType.SpikySlime: scoreGained += SPIKY_SLIME_SCORE; break;
            case EnemyType.Shooter: scoreGained += SHOOTER_SCORE; break;
            case EnemyType.Ghost: scoreGained += GHOST_SCORE; break;
            case EnemyType.LavaSlime: 
                scoreGained += LAVA_SLIME_SCORE;
                newHazards.push({
                    id: `hazard-${Date.now()}`,
                    type: HazardType.Lava,
                    pos: { x: enemy.pos.x, y: enemy.pos.y + TILE_SIZE / 2},
                    size: { x: TILE_SIZE, y: TILE_SIZE / 2 },
                    velocity: { x: 0, y: 0 },
                    duration: LAVA_POOL_DURATION,
                });
                break;
        }
        return false;
    }
    return true;
  });

  return { newPlayer, newEnemies, newProjectiles, newHazards, scoreGained, defeatedEnemiesCount };
};