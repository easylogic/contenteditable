import { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

type ScenarioCase = {
  id: string;
  caseTitle: string;
  os: string;
  browser: string;
  device: string;
  keyboard: string;
  status: 'draft' | 'confirmed';
  slug: string;
  tags: string[];
};

interface ScenarioFlowProps {
  scenarioId: string;
  scenarioTitle: string;
  scenarioDescription?: string;
  scenarioCategory?: string;
  cases: ScenarioCase[];
}

export default function ScenarioFlow({
  scenarioId,
  scenarioTitle,
  scenarioDescription,
  scenarioCategory,
  cases,
}: ScenarioFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const scenarioNodeId = `scenario-${scenarioId}`;

    // Scenario node
    nodes.push({
      id: scenarioNodeId,
      position: { x: 0, y: 0 },
      data: {
        label: scenarioTitle,
        description: scenarioDescription,
        kind: 'scenario',
      },
      style: {
        padding: 12,
        borderRadius: 12,
        border: '2px solid var(--accent-primary)',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        fontWeight: 600,
        minWidth: 220,
        textAlign: 'center',
      },
    });

    // Case nodes
    cases.forEach((c) => {
      const nodeId = `case-${c.id}`;
      nodes.push({
        id: nodeId,
        position: { x: 0, y: 0 },
        data: {
          label: c.caseTitle,
          meta: `${c.id} · ${c.os} · ${c.browser}`,
          status: c.status,
          url: `/cases/${c.slug}`,
          kind: 'case',
        },
        style: {
          padding: 10,
          borderRadius: 10,
          border: `1px solid ${
            c.status === 'confirmed'
              ? 'var(--status-confirmed, #16a34a)'
              : 'var(--status-draft, #f97316)'
          }`,
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          minWidth: 260,
          fontSize: 12,
        },
      });

      edges.push({
        id: `e-${scenarioNodeId}-${nodeId}`,
        source: scenarioNodeId,
        target: nodeId,
        animated: true,
        style: {
          stroke: 'var(--edge-scenario, #3b82f6)',
          strokeWidth: 1.2,
        },
      });
    });

    // Category node (optional)
    if (scenarioCategory) {
      const categoryId = `category-${scenarioCategory}`;
      nodes.push({
        id: categoryId,
        position: { x: 0, y: 0 },
        data: { label: `Category: ${scenarioCategory}`, kind: 'category' },
        style: {
          padding: 6,
          borderRadius: 999,
          border: '1px solid var(--border-light)',
          background: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          minWidth: 180,
          textAlign: 'center',
        },
      });

      edges.push({
        id: `e-${scenarioNodeId}-${categoryId}`,
        source: scenarioNodeId,
        target: categoryId,
        animated: false,
        style: {
          stroke: 'var(--edge-category, #10b981)',
          strokeWidth: 1,
          strokeDasharray: '4 2',
        },
      });
    }

    // Attribute nodes (aggregated per value, right side)
    const osValues = Array.from(new Set(cases.map((c) => c.os)));
    const browserValues = Array.from(new Set(cases.map((c) => c.browser)));
    const deviceValues = Array.from(new Set(cases.map((c) => c.device)));
    const keyboardValues = Array.from(new Set(cases.map((c) => c.keyboard)));

    osValues.forEach((os) => {
      const id = `os-${os}`;
      nodes.push({
        id,
        position: { x: 0, y: 0 },
        data: { label: os, kind: 'os' },
        style: {
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border-light)',
          background: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          minWidth: 110,
        },
      });
      cases
        .filter((c) => c.os === os)
        .forEach((c) => {
          edges.push({
            id: `e-case-${c.id}-os-${os}`,
            source: `case-${c.id}`,
            target: id,
            style: {
              stroke: 'var(--edge-os, #8b5cf6)',
              strokeWidth: 0.8,
            },
          });
        });
    });

    browserValues.forEach((browser) => {
      const id = `browser-${browser}`;
      nodes.push({
        id,
        position: { x: 0, y: 0 },
        data: { label: browser, kind: 'browser' },
        style: {
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border-light)',
          background: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          minWidth: 120,
        },
      });
      cases
        .filter((c) => c.browser === browser)
        .forEach((c) => {
          edges.push({
            id: `e-case-${c.id}-browser-${browser}`,
            source: `case-${c.id}`,
            target: id,
            style: {
              stroke: 'var(--edge-browser, #06b6d4)',
              strokeWidth: 0.8,
            },
          });
        });
    });

    deviceValues.forEach((device) => {
      const id = `device-${device}`;
      nodes.push({
        id,
        position: { x: 0, y: 0 },
        data: { label: device, kind: 'device' },
        style: {
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border-light)',
          background: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          minWidth: 140,
        },
      });
      cases
        .filter((c) => c.device === device)
        .forEach((c) => {
          edges.push({
            id: `e-case-${c.id}-device-${device}`,
            source: `case-${c.id}`,
            target: id,
            style: {
              stroke: 'var(--edge-device, #f97316)',
              strokeWidth: 0.8,
            },
          });
        });
    });

    keyboardValues.forEach((keyboard) => {
      const id = `keyboard-${keyboard}`;
      nodes.push({
        id,
        position: { x: 0, y: 0 },
        data: { label: keyboard, kind: 'keyboard' },
        style: {
          padding: 4,
          borderRadius: 8,
          border: '1px solid var(--border-light)',
          background: 'var(--bg-muted)',
          color: 'var(--text-secondary)',
          fontSize: 11,
          minWidth: 140,
        },
      });
      cases
        .filter((c) => c.keyboard === keyboard)
        .forEach((c) => {
          edges.push({
            id: `e-case-${c.id}-keyboard-${keyboard}`,
            source: `case-${c.id}`,
            target: id,
            style: {
              stroke: 'var(--edge-keyboard, #ec4899)',
              strokeWidth: 0.8,
            },
          });
        });
    });

    // Dagre layout
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
      rankdir: 'LR',
      nodesep: 60,
      ranksep: 160,
    });

    const getNodeSize = (node: Node) => {
      const kind = (node.data as any)?.kind;
      switch (kind) {
        case 'scenario':
          return { width: 260, height: 90 };
        case 'case':
          return { width: 280, height: 90 };
        case 'category':
          return { width: 220, height: 60 };
        case 'os':
        case 'browser':
        case 'device':
        case 'keyboard':
          return { width: 160, height: 60 };
        default:
          return { width: 180, height: 60 };
      }
    };

    nodes.forEach((node) => {
      const { width, height } = getNodeSize(node);
      dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes: Node[] = nodes.map((node) => {
      const pos = dagreGraph.node(node.id);
      const kind = (node.data as any)?.kind;
      return {
        ...node,
        position: { x: pos.x, y: pos.y },
        sourcePosition: 'right',
        targetPosition: 'left',
        draggable: true,
        // Slight visual tweak: attribute nodes can be smaller anchors
        style: {
          ...(node.style || {}),
          opacity: kind === 'case' || kind === 'scenario' ? 1 : 0.95,
        },
      };
    });

    const layoutedEdges: Edge[] = edges.map((edge) => ({
      ...edge,
      type: 'smoothstep',
    }));

    return { nodes: layoutedNodes, edges: layoutedEdges };
  }, [scenarioId, scenarioTitle, scenarioDescription, scenarioCategory, cases]);

  const onNodeClick = (_: any, node: Node) => {
    const url = (node.data as any)?.url;
    if (url) {
      window.location.href = url;
    }
  };

  return (
    <div style={{ width: '100%', height: 700 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        defaultEdgeOptions={{ type: 'smoothstep' }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        onNodeClick={onNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <MiniMap nodeStrokeColor="#64748b" nodeColor="#0f172a" />
        <Controls />
      </ReactFlow>
    </div>
  );
}


