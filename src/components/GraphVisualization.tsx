import { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';

interface GraphNode {
  id: string;
  label: string;
  color: string;
  size: number;
  shape: string;
  url?: string;
  status?: 'draft' | 'confirmed';
  metadata?: Record<string, any>;
}

interface GraphEdge {
  from: string;
  to: string;
  color: string;
  width: number;
  type: string;
}

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function GraphVisualization({ nodes, edges }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [filters, setFilters] = useState({
    case: true,
    scenario: true,
    tag: true,
    category: true,
    os: true,
    browser: true,
    device: true,
    keyboard: true,
    confirmed: true,
    draft: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const graphData = {
      nodes: new DataSet(nodes),
      edges: new DataSet(edges),
    };

    const options = {
      nodes: {
        borderWidth: 2,
        borderWidthSelected: 4,
        font: {
          size: 12,
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#000',
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 5,
          x: 2,
          y: 2,
        },
      },
      edges: {
        smooth: {
          type: 'continuous',
          roundness: 0.5,
        },
        arrows: {
          to: {
            enabled: false,
          },
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.1)',
          size: 3,
        },
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 200,
        },
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.1,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
      },
    };

    const network = new Network(containerRef.current, graphData, options);
    networkRef.current = network;

    // Node click handler
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = graphData.nodes.get(nodeId);
        if (node?.url) {
          window.location.href = node.url;
        }
      }
    });

    // Initial fit
    network.fit();

    return () => {
      network.destroy();
    };
  }, [nodes, edges]);

  const applyFilters = () => {
    if (!networkRef.current) return;

    const filteredNodes = nodes.filter((node) => {
      const typeMatch =
        (node.type === 'case' && filters.case) ||
        (node.type === 'scenario' && filters.scenario) ||
        (node.type === 'tag' && filters.tag) ||
        (node.type === 'category' && filters.category) ||
        (node.type === 'os' && filters.os) ||
        (node.type === 'browser' && filters.browser) ||
        (node.type === 'device' && filters.device) ||
        (node.type === 'keyboard' && filters.keyboard);

      const statusMatch =
        (node.status === 'confirmed' && filters.confirmed) ||
        (node.status === 'draft' && filters.draft) ||
        !node.status;

      return typeMatch && statusMatch;
    });

    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = edges.filter(
      (edge) => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to),
    );

    if (networkRef.current) {
      const graphData = {
        nodes: new DataSet(filteredNodes),
        edges: new DataSet(filteredEdges),
      };
      networkRef.current.setData(graphData);
      networkRef.current.fit();
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetLayout = () => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad',
        },
      });
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 flex-wrap items-center">
        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm text-text-secondary">Filter by type:</label>
          <div className="flex gap-2 flex-wrap">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.case}
                onChange={() => handleFilterChange('case')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
              Cases
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.scenario}
                onChange={() => handleFilterChange('scenario')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              Scenarios
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.tag}
                onChange={() => handleFilterChange('tag')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
              Tags
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category}
                onChange={() => handleFilterChange('category')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              Categories
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.os}
                onChange={() => handleFilterChange('os')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
              OS
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.browser}
                onChange={() => handleFilterChange('browser')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-500"></span>
              Browser
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.device}
                onChange={() => handleFilterChange('device')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
              Device
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.keyboard}
                onChange={() => handleFilterChange('keyboard')}
                className="w-4 h-4"
              />
              <span className="inline-block w-3 h-3 rounded-full bg-pink-500"></span>
              Keyboard
            </label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary">Status:</label>
          <div className="flex gap-2">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.confirmed}
                onChange={() => handleFilterChange('confirmed')}
                className="w-4 h-4"
              />
              Confirmed
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.draft}
                onChange={() => handleFilterChange('draft')}
                className="w-4 h-4"
              />
              Draft
            </label>
          </div>
        </div>
        <button
          onClick={resetLayout}
          className="px-3 py-1.5 text-sm bg-bg-muted border border-border-light rounded-md hover:bg-bg-surface transition-colors"
        >
          Reset Layout
        </button>
      </div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '800px',
          border: '1px solid',
          borderColor: 'var(--border-light)',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--bg-surface)',
        }}
      />
    </div>
  );
}

