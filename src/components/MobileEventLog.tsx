/**
 * Mobile-friendly Event Log component
 */

import React from 'react';
import type { PhaseBlock, EventLog } from '../components/Playground';
import { DebugText } from '../components/Playground';

interface MobileEventLogProps {
  phases: PhaseBlock[];
  isMobileView: boolean;
}

export function MobileEventLog({ phases, isMobileView }: MobileEventLogProps) {
  if (phases.length === 0) {
    return (
      <div className="p-4 text-center text-text-muted bg-bg-muted rounded-lg text-sm">
        No events yet. Start typing in the editor to see events.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {phases.map((phase, idx) => (
        <div key={idx} className={`p-3 rounded-lg border ${
          phase.highlight === 'error' ? 'bg-red-50 dark:bg-red-950/20 border-red-500' :
          phase.highlight === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500' :
          'bg-bg-surface border-border-light'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-sm text-text-primary">
              {phase.title}
            </div>
            <div className="text-xs text-text-muted">
              +{phase.delta}ms
            </div>
          </div>
          
          {phase.log && (
            <div className={`space-y-1 text-xs ${isMobileView ? '' : 'text-text-secondary'}`}>
              <div className="flex justify-between">
                <span>Type:</span>
                <span className="font-mono">{phase.log.type}</span>
              </div>
              {phase.log.inputType && (
                <div className="flex justify-between">
                  <span>Input:</span>
                  <span className="font-mono">{phase.log.inputType}</span>
                </div>
              )}
              {phase.log.data && (
                <div className="flex flex-col">
                  <span>Data:</span>
                  <span className="font-mono break-all">
                    "<DebugText text={phase.log.data} />
                  </span>
                </div>
              )}
              {phase.log.isComposing !== undefined && (
                <div className="flex justify-between">
                  <span>Composing:</span>
                  <span className="font-mono">{phase.log.isComposing ? 'Yes' : 'No'}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Node:</span>
                <span className="font-mono text-right">
                  {phase.log.node?.nodeName || '-'}
                  {phase.log.node?.id && `#${phase.log.node.id}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Offset:</span>
                <span className="font-mono">{phase.log.startOffset}→{phase.log.endOffset}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}