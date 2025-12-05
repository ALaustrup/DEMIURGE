/**
 * World Engine - Main Simulation Loop
 */

import { WorldClock } from './worldClock';
import { PhysicsEngine } from './physics';
import { BioModel } from './bioModel';
import { SocietyModel } from './societyModel';
import { EvolutionModel } from './evolution';
import { RulesEngine } from './rules';
import { StateManager } from './stateManager';
import type { WorldState, Entity, Species } from '../types';

export class WorldEngine {
  private state: WorldState;
  private clock: WorldClock;
  private physics: PhysicsEngine;
  private bio: BioModel;
  private society: SocietyModel;
  private evolution: EvolutionModel;
  private rules: RulesEngine;
  private stateManager: StateManager;
  private isRunning: boolean = false;
  private tickListeners: Set<(state: WorldState) => void> = new Set();
  
  constructor(state: WorldState) {
    this.state = state;
    this.clock = new WorldClock({ tickRate: 30 });
    this.physics = new PhysicsEngine(state.physics);
    this.bio = new BioModel(state.bio);
    this.society = new SocietyModel(state.society);
    this.evolution = new EvolutionModel(state.evolution);
    this.rules = new RulesEngine();
    this.stateManager = new StateManager();
    
    // Load rules
    if (state.rules.length > 0) {
      this.rules.updateRules(state.rules);
    }
  }
  
  /**
   * Start simulation
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.clock.start((delta) => this.tick(delta));
  }
  
  /**
   * Stop simulation
   */
  stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    this.clock.stop();
  }
  
  /**
   * Pause simulation
   */
  pause(): void {
    this.clock.pause();
  }
  
  /**
   * Resume simulation
   */
  resume(): void {
    this.clock.resume();
  }
  
  /**
   * Step one tick
   */
  step(): void {
    this.clock.step();
  }
  
  /**
   * Set tick rate
   */
  setTickRate(rate: number): void {
    this.clock.setTickRate(rate);
  }
  
  /**
   * Get current state
   */
  getState(): WorldState {
    return this.state;
  }
  
  /**
   * Update state (partial)
   */
  setState(partial: Partial<WorldState>): void {
    this.state = { ...this.state, ...partial };
  }
  
  /**
   * Spawn entity
   */
  spawnEntity(position: { x: number; y: number; z: number }, mass: number = 1, properties: Record<string, any> = {}): string {
    const entityId = `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const entity = this.physics.spawnEntity(entityId, position, mass, properties);
    this.state.entities.set(entityId, entity);
    return entityId;
  }
  
  /**
   * Apply force to entity
   */
  applyForce(entityId: string, force: { x: number; y: number; z: number }): void {
    const entity = this.state.entities.get(entityId);
    if (entity) {
      this.physics.applyForce(entity, force);
    }
  }
  
  /**
   * Run evolution cycle
   */
  runEvolutionCycle(): void {
    const newSpecies = this.evolution.runCycle(this.state.species);
    for (const species of newSpecies) {
      this.state.species.set(species.id, species);
    }
  }
  
  /**
   * Main tick function
   */
  private tick(delta: number): void {
    // Update physics
    this.physics.update(this.state.entities, delta);
    
    // Update biology
    const newEntities = this.bio.update(this.state.entities, this.state.species, delta);
    for (const entity of newEntities) {
      this.state.entities.set(entity.id, entity);
    }
    
    // Update society
    this.society.update(this.state.entities, delta);
    
    // Update species fitness
    for (const species of this.state.species.values()) {
      this.bio.updateSpeciesFitness(species, this.state.entities);
    }
    
    // Run evolution (periodically)
    if (this.state.tick % 100 === 0) {
      this.runEvolutionCycle();
    }
    
    // Evaluate rules
    this.rules.evaluate(this.state, delta);
    
    // Update tick counter
    this.state.tick++;
    this.state.timestamp = Date.now();
    
    // Update Merkle root (async, but we'll do it periodically)
    if (this.state.tick % 10 === 0) {
      import('../utils').then(({ calculateWorldMerkleRoot }) => {
        calculateWorldMerkleRoot(this.state).then(root => {
          this.state.merkleRoot = root;
        });
      });
    }
    
    // Notify listeners
    this.notifyListeners();
  }
  
  /**
   * Subscribe to tick events
   */
  onTick(callback: (state: WorldState) => void): () => void {
    this.tickListeners.add(callback);
    return () => this.tickListeners.delete(callback);
  }
  
  /**
   * Notify tick listeners
   */
  private notifyListeners(): void {
    for (const listener of this.tickListeners) {
      try {
        listener(this.state);
      } catch (error) {
        console.error('[WorldEngine] Listener error:', error);
      }
    }
  }
  
  /**
   * Create snapshot
   */
  createSnapshot() {
    return this.stateManager.createSnapshot(this.state);
  }
  
  /**
   * Restore from snapshot
   */
  restoreFromSnapshot(snapshot: any): void {
    this.state = this.stateManager.restoreFromSnapshot(snapshot);
    // Reinitialize engines with new state
    this.physics = new PhysicsEngine(this.state.physics);
    this.bio = new BioModel(this.state.bio);
    this.society = new SocietyModel(this.state.society);
    this.evolution = new EvolutionModel(this.state.evolution);
  }
}

