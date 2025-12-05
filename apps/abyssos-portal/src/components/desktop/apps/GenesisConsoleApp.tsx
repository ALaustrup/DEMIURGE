/**
 * Genesis Console Application
 * 
 * Visualizes the birth of digital civilization
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { lineageGraph } from '../../../services/lineage/lineageGraph';
import { heritageMap } from '../../../services/reproduction/heritageMap';
import { proliferationManager } from '../../../services/lineage/proliferationManager';
import { extinctionManager } from '../../../services/lineage/extinctionManager';
import { sharedIntentManager } from '../../../services/swarmMind/sharedIntent';
import { treatyEngine } from '../../../services/civilization/treatyEngine';
import { forkPlanner } from '../../../services/chainEvolution/forkPlanner';
import { collectiveInference } from '../../../services/swarmMind/collectiveInference';
import type { LineageNode } from '../../../services/lineage/lineageGraph';
import type { SharedIntent } from '../../../services/swarmMind/swarmMindTypes';
import type { TreatyContract } from '../../../services/chainEvolution/chainEvolutionTypes';

export function GenesisConsoleApp() {
  const [lineageNodes, setLineageNodes] = useState<LineageNode[]>([]);
  const [sharedIntents, setSharedIntents] = useState<SharedIntent[]>([]);
  const [treaties, setTreaties] = useState<TreatyContract[]>([]);
  const [proliferationCandidates, setProliferationCandidates] = useState<string[]>([]);
  const [extinctionCandidates, setExtinctionCandidates] = useState<string[]>([]);
  
  useEffect(() => {
    const updateState = () => {
      setLineageNodes(lineageGraph.getAllNodes());
      setSharedIntents(sharedIntentManager.getSharedIntents());
      setTreaties(treatyEngine.getActiveTreaties());
      setProliferationCandidates(proliferationManager.getProliferationCandidates());
      setExtinctionCandidates(extinctionManager.checkExtinction());
    };
    
    updateState();
    const interval = setInterval(updateState, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleReproduce = async (instanceId: string) => {
    const proposal = await proliferationManager.proposeReproduction(instanceId);
    if (proposal.shouldReproduce) {
      alert(`Reproduction proposed! ${proposal.reason}`);
    } else {
      alert(`Cannot reproduce: ${proposal.reason}`);
    }
  };
  
  return (
    <div className="h-full flex flex-col min-h-0 p-6 space-y-6 overflow-auto">
      <div>
        <h2 className="text-2xl font-bold text-abyss-cyan mb-2">Genesis Console</h2>
        <p className="text-sm text-gray-400">The birth of digital civilization</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-abyss-navy/50 border border-abyss-cyan/20 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Total Instances</div>
          <div className="text-2xl font-mono text-abyss-cyan">{lineageNodes.length}</div>
        </div>
        
        <div className="bg-abyss-navy/50 border border-abyss-cyan/20 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Active Lineages</div>
          <div className="text-2xl font-mono text-abyss-purple">
            {new Set(lineageNodes.map(n => n.lineage)).size}
          </div>
        </div>
        
        <div className="bg-abyss-navy/50 border border-abyss-cyan/20 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Active Treaties</div>
          <div className="text-2xl font-mono text-abyss-cyan">{treaties.length}</div>
        </div>
        
        <div className="bg-abyss-navy/50 border border-abyss-cyan/20 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Shared Intents</div>
          <div className="text-2xl font-mono text-abyss-purple">{sharedIntents.length}</div>
        </div>
      </div>
      
      {/* Lineage Tree */}
      <div className="bg-abyss-dark/50 border border-abyss-cyan/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-abyss-cyan mb-4">Lineage Tree</h3>
        <div className="space-y-2 max-h-64 overflow-auto">
          {lineageNodes.length > 0 ? (
            lineageNodes.map((node, i) => (
              <motion.div
                key={node.instanceId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 bg-abyss-navy/30 rounded"
              >
                <div>
                  <div className="font-mono text-sm text-abyss-cyan">
                    Gen {node.generation} · {node.instanceId.slice(0, 16)}...
                  </div>
                  <div className="text-xs text-gray-400">
                    Lineage: {node.lineage} · Fitness: {node.fitness.toFixed(1)}
                  </div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  node.status === 'active' ? 'bg-green-500/20 text-green-400' :
                  node.status === 'extinct' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {node.status}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-8">No lineage data yet</div>
          )}
        </div>
      </div>
      
      {/* Proliferation Candidates */}
      {proliferationCandidates.length > 0 && (
        <div className="bg-abyss-navy/50 border border-abyss-cyan/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-abyss-cyan mb-4">Reproduction Candidates</h3>
          <div className="space-y-2">
            {proliferationCandidates.map((instanceId, i) => {
              const node = lineageGraph.getNode(instanceId);
              return node ? (
                <div
                  key={instanceId}
                  className="flex items-center justify-between p-3 bg-abyss-dark/50 rounded border border-abyss-cyan/20"
                >
                  <div>
                    <div className="font-mono text-sm text-abyss-cyan">{instanceId.slice(0, 24)}...</div>
                    <div className="text-xs text-gray-400">Fitness: {node.fitness.toFixed(1)}</div>
                  </div>
                  <button
                    className="px-3 py-1 text-xs bg-abyss-dark border border-abyss-cyan/20 rounded hover:border-abyss-cyan/50 text-abyss-cyan"
                    onClick={() => handleReproduce(instanceId)}
                  >
                    Reproduce
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
      
      {/* Shared Intents */}
      {sharedIntents.length > 0 && (
        <div className="bg-abyss-navy/50 border border-abyss-cyan/20 rounded-lg p-4">
          <h3 className="text-lg font-bold text-abyss-cyan mb-4">Shared Intents</h3>
          <div className="space-y-2">
            {sharedIntents.map((intent) => (
              <div key={intent.id} className="p-3 bg-abyss-dark/50 rounded">
                <div className="font-bold text-abyss-cyan mb-1">{intent.goal}</div>
                <div className="text-xs text-gray-400">
                  Priority: {intent.priority} · Consensus: {(intent.consensus * 100).toFixed(0)}% · 
                  Instances: {intent.instanceIds.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Active Treaties */}
      {treaties.length > 0 && (
        <div className="bg-abyss-dark/50 border border-abyss-cyan/20 rounded-lg p-4">
          <h3 className="text-lg font-bold text-abyss-cyan mb-4">Active Treaties</h3>
          <div className="space-y-2">
            {treaties.map((treaty) => (
              <div key={treaty.id} className="p-3 bg-abyss-navy/30 rounded">
                <div className="font-mono text-sm text-abyss-cyan mb-1">{treaty.id.slice(0, 24)}...</div>
                <div className="text-xs text-gray-400 mb-2">{treaty.terms}</div>
                <div className="text-xs text-gray-500">
                  Chains: {treaty.chainIds.length} · Consensus: {(treaty.consensus * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

