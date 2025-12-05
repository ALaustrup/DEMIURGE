/**
 * Physics Engine
 * 
 * Lightweight physics simulation for AWE
 */

import type { Entity, Vec3, PhysicsConfig } from '../types';
import { distance, normalize, clamp } from '../utils';

export class PhysicsEngine {
  private config: PhysicsConfig;
  
  constructor(config: PhysicsConfig) {
    this.config = config;
  }
  
  /**
   * Update physics for all entities
   */
  update(entities: Map<string, Entity>, delta: number): void {
    // Apply gravity
    for (const entity of entities.values()) {
      if (entity.mass > 0) {
        entity.velocity.y -= this.config.gravity * delta;
      }
    }
    
    // Apply friction
    const frictionFactor = 1 - (this.config.friction * delta);
    for (const entity of entities.values()) {
      entity.velocity.x *= frictionFactor;
      entity.velocity.y *= frictionFactor;
      entity.velocity.z *= frictionFactor;
    }
    
    // Update positions
    for (const entity of entities.values()) {
      entity.position.x += entity.velocity.x * delta;
      entity.position.y += entity.velocity.y * delta;
      entity.position.z += entity.velocity.z * delta;
    }
    
    // Handle collisions if enabled
    if (this.config.collisionEnabled) {
      this.handleCollisions(entities);
    }
    
    // Enforce bounds
    this.enforceBounds(entities);
  }
  
  /**
   * Handle collisions between entities
   */
  private handleCollisions(entities: Map<string, Entity>): void {
    const entityArray = Array.from(entities.values());
    
    for (let i = 0; i < entityArray.length; i++) {
      for (let j = i + 1; j < entityArray.length; j++) {
        const a = entityArray[i];
        const b = entityArray[j];
        
        const dist = distance(a.position, b.position);
        const minDist = (a.properties.radius || 0.5) + (b.properties.radius || 0.5);
        
        if (dist < minDist && dist > 0) {
          // Simple elastic collision
          const normal = normalize({
            x: b.position.x - a.position.x,
            y: b.position.y - a.position.y,
            z: b.position.z - a.position.z,
          });
          
          // Separate entities
          const overlap = minDist - dist;
          const separation = {
            x: normal.x * overlap * 0.5,
            y: normal.y * overlap * 0.5,
            z: normal.z * overlap * 0.5,
          };
          
          a.position.x -= separation.x;
          a.position.y -= separation.y;
          a.position.z -= separation.z;
          
          b.position.x += separation.x;
          b.position.y += separation.y;
          b.position.z += separation.z;
          
          // Exchange momentum (simplified)
          const relativeVel = {
            x: b.velocity.x - a.velocity.x,
            y: b.velocity.y - a.velocity.y,
            z: b.velocity.z - a.velocity.z,
          };
          
          const dot = relativeVel.x * normal.x + relativeVel.y * normal.y + relativeVel.z * normal.z;
          
          if (dot < 0) {
            const impulse = 2 * dot / (a.mass + b.mass);
            
            a.velocity.x += impulse * b.mass * normal.x;
            a.velocity.y += impulse * b.mass * normal.y;
            a.velocity.z += impulse * b.mass * normal.z;
            
            b.velocity.x -= impulse * a.mass * normal.x;
            b.velocity.y -= impulse * a.mass * normal.y;
            b.velocity.z -= impulse * a.mass * normal.z;
          }
        }
      }
    }
  }
  
  /**
   * Enforce world bounds
   */
  private enforceBounds(entities: Map<string, Entity>): void {
    const bounds = this.config.bounds;
    
    for (const entity of entities.values()) {
      // Clamp position to bounds
      entity.position.x = clamp(entity.position.x, -bounds.width / 2, bounds.width / 2);
      entity.position.y = clamp(entity.position.y, -bounds.height / 2, bounds.height / 2);
      entity.position.z = clamp(entity.position.z, -bounds.depth / 2, bounds.depth / 2);
      
      // Bounce off walls
      if (Math.abs(entity.position.x) >= bounds.width / 2) {
        entity.velocity.x *= -0.8;
      }
      if (Math.abs(entity.position.y) >= bounds.height / 2) {
        entity.velocity.y *= -0.8;
      }
      if (Math.abs(entity.position.z) >= bounds.depth / 2) {
        entity.velocity.z *= -0.8;
      }
    }
  }
  
  /**
   * Apply force to entity
   */
  applyForce(entity: Entity, force: Vec3): void {
    if (entity.mass > 0) {
      const acceleration = {
        x: force.x / entity.mass,
        y: force.y / entity.mass,
        z: force.z / entity.mass,
      };
      
      entity.velocity.x += acceleration.x;
      entity.velocity.y += acceleration.y;
      entity.velocity.z += acceleration.z;
    }
  }
  
  /**
   * Spawn entity at position
   */
  spawnEntity(
    id: string,
    position: Vec3,
    mass: number = 1,
    properties: Record<string, any> = {}
  ): Entity {
    return {
      id,
      position: { ...position },
      velocity: { x: 0, y: 0, z: 0 },
      mass,
      properties: {
        radius: 0.5,
        ...properties,
      },
      age: 0,
      energy: 100,
    };
  }
}

