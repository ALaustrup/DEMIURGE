/**
 * AWE (Autonomous World Engine) Types
 */

export type WorldID = string;
export type EntityID = string;
export type SpeciesID = string;
export type RuleID = string;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Entity {
  id: EntityID;
  position: Vec3;
  velocity: Vec3;
  mass: number;
  speciesId?: SpeciesID;
  properties: Record<string, any>;
  age: number;
  energy?: number;
  metadata?: Record<string, any>;
}

export interface Species {
  id: SpeciesID;
  name: string;
  traits: Record<string, number>;
  genome: string[];
  population: number;
  fitness: number;
  createdAt: number;
  parentSpeciesId?: SpeciesID;
}

export interface WorldState {
  id: WorldID;
  seed: string;
  tick: number;
  entities: Map<EntityID, Entity>;
  species: Map<SpeciesID, Species>;
  rules: Rule[];
  physics: PhysicsConfig;
  bio: BioConfig;
  society: SocietyConfig;
  evolution: EvolutionConfig;
  timestamp: number;
  merkleRoot?: string;
}

export interface PhysicsConfig {
  gravity: number;
  friction: number;
  collisionEnabled: boolean;
  bounds: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface BioConfig {
  metabolismRate: number;
  replicationThreshold: number;
  mutationRate: number;
  energyDecay: number;
  maxAge: number;
}

export interface SocietyConfig {
  tradeEnabled: boolean;
  treatyEnabled: boolean;
  socialGraphEnabled: boolean;
  currencyEnabled: boolean;
}

export interface EvolutionConfig {
  selectionPressure: number;
  mutationRate: number;
  speciationThreshold: number;
  extinctionThreshold: number;
}

export interface Rule {
  id: RuleID;
  name: string;
  condition: string; // Expression or function
  action: string; // Expression or function
  priority: number;
  enabled: boolean;
}

export interface WorldSnapshot {
  worldId: WorldID;
  tick: number;
  state: WorldState;
  timestamp: number;
  merkleRoot: string;
}

export interface AWEComputeRequest {
  worldId: WorldID;
  fromTick: number;
  toTick: number;
  partialState?: Partial<WorldState>;
}

export interface AWEComputeResponse {
  worldId: WorldID;
  fromTick: number;
  toTick: number;
  delta: Partial<WorldState>;
  merkleRoot: string;
}

