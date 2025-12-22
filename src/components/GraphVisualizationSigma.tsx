import { useEffect, useRef, useState } from 'react';

interface GraphNode {
  id: string;
  label: string;
  color: string;
  size: number;
  shape: string;
  url?: string;
  status?: 'draft' | 'confirmed';
  type: string;
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

export default function GraphVisualizationSigma({ nodes, edges }: GraphVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<any>(null);
  const [filters, setFilters] = useState({
    case: true,
    scenario: true,
    confirmed: true,
    draft: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamic import to avoid SSR issues with WebGL
    Promise.all([
      import('graphology'),
      import('sigma'),
    ]).then((modules) => {
      const Graph = modules[0].default;
      const SigmaInit = modules[1].default;
      if (!containerRef.current) return;
      
      // Create graphology graph
      const graph = new Graph();

    // Add nodes with initial positions if provided
    nodes.forEach((node) => {
      const nodeData: any = {
        label: node.label,
        size: node.size,
        color: node.color,
        url: node.url,
        status: node.status,
        nodeType: node.type || (node as any).nodeType, // Renamed from 'type' to avoid conflict with sigma.js
        shape: node.shape, // Use shape from props
        metadata: node.metadata,
      };
      
      // Use provided x, y coordinates if available, otherwise random
      if ((node as any).x !== undefined && (node as any).y !== undefined) {
        nodeData.x = (node as any).x;
        nodeData.y = (node as any).y;
      } else {
        nodeData.x = Math.random() * 1000;
        nodeData.y = Math.random() * 1000;
      }
      
      graph.addNode(node.id, nodeData);
    });

    // Add edges (avoid duplicates)
    const addedEdges = new Set<string>();
    edges.forEach((edge) => {
      if (graph.hasNode(edge.from) && graph.hasNode(edge.to)) {
        // Create unique key for edge to avoid duplicates
        const edgeKey = `${edge.from}-${edge.to}`;
        const reverseKey = `${edge.to}-${edge.from}`;
        
        // Check if edge already exists (in either direction for undirected graphs)
        if (!addedEdges.has(edgeKey) && !addedEdges.has(reverseKey)) {
          try {
            graph.addEdge(edge.from, edge.to, {
              color: edge.color,
              size: edge.width || (edge as any).size,
              edgeType: edge.type || (edge as any).edgeType, // Renamed from 'type' to avoid conflict with sigma.js
            });
            addedEdges.add(edgeKey);
          } catch (e) {
            // Edge already exists, skip
            console.warn(`Edge ${edgeKey} already exists, skipping`);
          }
        }
      }
    });

      // Create sigma instance
      const sigma = new SigmaInit(graph, containerRef.current, {
        renderLabels: true,
        labelFont: 'Inter, system-ui, sans-serif',
        labelSize: 12,
        labelWeight: 'normal',
        labelColor: { attribute: 'color', defaultValue: '#000' },
        defaultNodeColor: '#999',
        defaultEdgeColor: '#999',
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
        allowInvalidContainer: true,
        zIndex: true,
      });

      sigmaRef.current = sigma;

      // Enable node dragging
      let draggedNode: string | null = null;
      let isDragging = false;

      sigma.on('downNode', (e) => {
        draggedNode = e.node;
        isDragging = false;
        sigma.getCamera().disable();
      });

      sigma.on('mousedown', () => {
        if (draggedNode) {
          isDragging = true;
        }
      });

      sigma.on('mouseup', () => {
        if (draggedNode && !isDragging) {
          // Only navigate if it was a click, not a drag
          const nodeData = graph.getNodeAttributes(draggedNode);
          if (nodeData.url) {
            window.location.href = nodeData.url;
          }
        }
        draggedNode = null;
        isDragging = false;
        sigma.getCamera().enable();
      });

      sigma.on('mousemovebody', () => {
        if (draggedNode && isDragging) {
          // Node is being dragged, update its position
          const pos = sigma.getNodeDisplayData(draggedNode);
          if (pos) {
            graph.setNodeAttribute(draggedNode, 'x', pos.x);
            graph.setNodeAttribute(draggedNode, 'y', pos.y);
          }
        }
      });

      // Fit to view
      try {
        const bbox = sigma.getBbox();
        if (bbox && bbox.x !== undefined && bbox.y !== undefined) {
          sigma.getCamera().animate(bbox, {
            duration: 1000,
          });
        }
      } catch (e) {
        console.warn('Failed to fit graph to view:', e);
      }
    }).catch((error) => {
      console.error('Failed to load graph libraries:', error);
    });

    return () => {
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [nodes, edges]);

  const applyFilters = async () => {
    if (!sigmaRef.current || !containerRef.current) return;

    const modules = await Promise.all([
      import('graphology'),
      import('sigma'),
    ]);
    const Graph = modules[0].default;
    const SigmaFilter = modules[1].default;

            // Filter nodes
    const filteredNodes = nodes.filter((node) => {
      const nodeType = node.type || (node as any).nodeType;
      const typeMatch =
        (nodeType === 'case' && filters.case) ||
        (nodeType === 'scenario' && filters.scenario);

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

    // Rebuild graph with new Graph instance
    const newGraph = new Graph();

    filteredNodes.forEach((node) => {
      const nodeData: any = {
        label: node.label,
        size: node.size,
        color: node.color,
        url: node.url,
        status: node.status,
        nodeType: node.type || (node as any).nodeType, // Renamed from 'type' to avoid conflict with sigma.js
        shape: node.shape, // Use shape from props
        metadata: node.metadata,
      };
      
      // Use provided x, y coordinates if available, otherwise random
      if ((node as any).x !== undefined && (node as any).y !== undefined) {
        nodeData.x = (node as any).x;
        nodeData.y = (node as any).y;
      } else {
        nodeData.x = Math.random() * 1000;
        nodeData.y = Math.random() * 1000;
      }
      
      newGraph.addNode(node.id, nodeData);
    });

    // Add edges (avoid duplicates)
    const addedEdges = new Set<string>();
    filteredEdges.forEach((edge) => {
      if (newGraph.hasNode(edge.from) && newGraph.hasNode(edge.to)) {
        // Create unique key for edge to avoid duplicates
        const edgeKey = `${edge.from}-${edge.to}`;
        const reverseKey = `${edge.to}-${edge.from}`;
        
        // Check if edge already exists (in either direction for undirected graphs)
        if (!addedEdges.has(edgeKey) && !addedEdges.has(reverseKey)) {
          try {
            newGraph.addEdge(edge.from, edge.to, {
              color: edge.color,
              size: edge.width || (edge as any).size,
              edgeType: edge.type || (edge as any).edgeType, // Renamed from 'type' to avoid conflict with sigma.js
            });
            addedEdges.add(edgeKey);
          } catch (e) {
            // Edge already exists, skip
            console.warn(`Edge ${edgeKey} already exists, skipping`);
          }
        }
      }
    });

    // Update sigma with new graph
    if (sigmaRef.current) {
      sigmaRef.current.kill();
    }
    
    if (containerRef.current) {
      const newSigma = new SigmaFilter(newGraph, containerRef.current, {
        renderLabels: true,
        labelFont: 'Inter, system-ui, sans-serif',
        labelSize: 12,
        labelWeight: 'normal',
        labelColor: { attribute: 'color', defaultValue: '#000' },
        defaultNodeColor: '#999',
        defaultEdgeColor: '#999',
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
        allowInvalidContainer: true,
        zIndex: true,
      });
      
      sigmaRef.current = newSigma;
      
      // Enable node dragging for filtered graph
      let draggedNode: string | null = null;
      let isDragging = false;

      newSigma.on('downNode', (e) => {
        draggedNode = e.node;
        isDragging = false;
        newSigma.getCamera().disable();
      });

      newSigma.on('mousedown', () => {
        if (draggedNode) {
          isDragging = true;
        }
      });

      newSigma.on('mouseup', () => {
        if (draggedNode && !isDragging) {
          // Only navigate if it was a click, not a drag
          const nodeData = newGraph.getNodeAttributes(draggedNode);
          if (nodeData.url) {
            window.location.href = nodeData.url;
          }
        }
        draggedNode = null;
        isDragging = false;
        newSigma.getCamera().enable();
      });

      newSigma.on('mousemovebody', () => {
        if (draggedNode && isDragging) {
          // Node is being dragged, update its position
          const pos = newSigma.getNodeDisplayData(draggedNode);
          if (pos) {
            newGraph.setNodeAttribute(draggedNode, 'x', pos.x);
            newGraph.setNodeAttribute(draggedNode, 'y', pos.y);
          }
        }
      });
      
      try {
        const bbox = newSigma.getBbox();
        if (bbox && bbox.x !== undefined && bbox.y !== undefined && newGraph.order > 0) {
          newSigma.getCamera().animate(bbox, {
            duration: 500,
          });
        }
      } catch (e) {
        console.warn('Failed to fit filtered graph to view:', e);
      }
    }
  };

  useEffect(() => {
    // Only apply filters if sigma is already initialized
    if (sigmaRef.current) {
      applyFilters();
    }
  }, [filters]);

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetLayout = () => {
    if (sigmaRef.current) {
      try {
        const bbox = sigmaRef.current.getBbox();
        if (bbox && bbox.x !== undefined && bbox.y !== undefined) {
          sigmaRef.current.getCamera().animate(bbox, {
            duration: 1000,
          });
        }
      } catch (e) {
        console.warn('Failed to reset layout:', e);
      }
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

