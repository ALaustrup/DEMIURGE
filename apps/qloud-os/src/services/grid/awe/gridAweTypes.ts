/**
 * Grid AWE Types
 */

import type { WorldID, WorldState } from '../../../awe/types';

export interface AWEStateSync {
  worldId: WorldID;
  state: Partial<WorldState>;
  tick: number;
  merkleRoot: string;
}

export interface AWEStateDelta {
  worldId: WorldID;
  fromTick: number;
  toTick: number;
  changes: {
    entities?: Array<{ id: string; action: 'add' | 'update' | 'remove'; data?: any }>;
    species?: Array<{ id: string; action: 'add' | 'update' | 'remove'; data?: any }>;
  };
  merkleRoot: string;
}

export interface AWEComputeRequest {
  worldId: WorldID;
  fromTick: number;
  toTick: number;
  partialState?: Partial<WorldState>;
  requestId: string;
}

export interface AWEComputeResponse {
  requestId: string;
  worldId: WorldID;
  fromTick: number;
  toTick: number;
  delta: AWEStateDelta;
  merkleRoot: string;
}

