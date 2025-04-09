import { useState, useEffect } from 'react';
import { Hash, Server, Plus, Minus, RefreshCw } from 'lucide-react';

interface DataPoint {
  key: string;
  value: string;
  color: string;
  position: number;
}

interface Node {
  id: string;
  position: number;
  color: string;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'
];

function generateHash(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash % 360);
}

function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [autoAddData, setAutoAddData] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(0);
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

  const addNode = () => {
    if (nodes.length >= 8) return;
    
    const newCounter = nodeCounter + 1;
    const id = 'node-' + newCounter;
    const position = Math.floor(Math.random() * 360);
    const color = COLORS[nodes.length];
    
    setNodeCounter(newCounter);
    setNodes(prev => [...prev, { id, position, color }]);
  };

  const removeNode = () => {
    if (nodes.length <= 1) return;
    setNodes(prev => prev.slice(0, -1));
  };

  const addDataPoint = () => {
    const key = 'data-' + Math.random().toString(36).substr(2, 9);
    const value = Math.random().toString(36).substr(2, 5);
    const position = generateHash(key);
    
    // Find the nearest node clockwise
    let nearestNode = nodes[0];
    let minDistance = 360;
    
    for (const node of nodes) {
      const distance = (node.position - position + 360) % 360;
      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = node;
      }
    }
    
    setDataPoints(prev => [...prev, {
      key,
      value,
      color: nearestNode.color,
      position
    }]);
  };

  useEffect(() => {
    // Initialize with 3 nodes
    const initialNodes = Array.from({ length: 3 }, (_, i) => ({
      id: 'node-' + (i + 1),
      position: Math.floor((i * 360 / 3) + Math.random() * 30),
      color: COLORS[i]
    }));
    
    setNodes(initialNodes);
    setNodeCounter(3);
  }, []);

  useEffect(() => {
    let interval: number;
    if (autoAddData) {
      interval = window.setInterval(() => {
        if (nodes.length > 0) {
          addDataPoint();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoAddData, nodes]);

  // Reassign data points when nodes change
  useEffect(() => {
    if (nodes.length === 0) {
      setDataPoints([]);
      return;
    }

    setDataPoints(prev => prev.map(dp => {
      const position = generateHash(dp.key);
      let nearestNode = nodes[0];
      let minDistance = 360;
      
      for (const node of nodes) {
        const distance = (node.position - position + 360) % 360;
        if (distance < minDistance) {
          minDistance = distance;
          nearestNode = node;
        }
      }
      
      return {
        ...dp,
        color: nearestNode.color,
        position
      };
    }));
  }, [nodes]);

  return (
    <div className="min-h-screen bg-gray-100 p-2 md:p-8">
      <div className="max-w-full md:max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-3 md:p-6">
          {/* Header section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
              <Hash className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              <h1 className="text-lg md:text-2xl font-bold text-gray-800 text-center md:text-left">
                Consistent Hashing Simulation
              </h1>
            </div>
            
            {/* Control buttons */}
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              <button
                onClick={addNode}
                disabled={nodes.length >= 8}
                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-sm md:text-base rounded hover:bg-blue-700 disabled:opacity-50 min-w-[100px]"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" /> Add Node
              </button>
              <button
                onClick={removeNode}
                disabled={nodes.length <= 1}
                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white text-sm md:text-base rounded hover:bg-red-700 disabled:opacity-50 min-w-[100px]"
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4" /> Remove Node
              </button>
              <button
                onClick={addDataPoint}
                disabled={nodes.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white text-sm md:text-base rounded hover:bg-green-700 disabled:opacity-50 min-w-[100px]"
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" /> Add Data
              </button>
              <button
                onClick={() => setAutoAddData(!autoAddData)}
                className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-3 py-1.5 md:px-4 md:py-2 ${
                  autoAddData ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                } text-white text-sm md:text-base rounded min-w-[100px]`}
              >
                <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${autoAddData ? 'animate-spin' : ''}`} />
                {autoAddData ? 'Stop Auto' : 'Start Auto'}
              </button>
            </div>
          </div>

          {/* Hash ring visualization */}
          <div className="relative aspect-square max-w-[min(80vw,600px)] mx-auto">
            <div className="absolute inset-0">
              {/* Hash ring circle */}
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 border-4 border-gray-200 rounded-full">
                {/* Data points */}
                {dataPoints.map((dp) => {
                  const angle = (dp.position * Math.PI) / 180;
                  const radius = Math.min(window.innerWidth * 0.35, 250);
                  const x = radius + Math.cos(angle) * radius;
                  const y = radius + Math.sin(angle) * radius;

                  return (
                    <div
                      key={dp.key}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-in-out"
                      style={{
                        left: `${(x / (radius * 2)) * 100}%`,
                        top: `${(y / (radius * 2)) * 100}%`,
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease-out forwards',
                      }}
                      onMouseEnter={() => setHoveredData(dp)}
                      onMouseLeave={() => setHoveredData(null)}
                    >
                      <div
                        className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: dp.color,
                          transform: 'scale(0)',
                          animation: 'scaleIn 0.5s ease-out forwards',
                        }}
                      />
                      {hoveredData?.key === dp.key && (
                        <div className="absolute z-10 bg-white p-2 rounded shadow-lg -translate-x-1/2 whitespace-nowrap text-xs md:text-sm">
                          <div><strong>Key:</strong> {dp.key}</div>
                          <div><strong>Value:</strong> {dp.value}</div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  const angle = (node.position * Math.PI) / 180;
                  const radius = Math.min(window.innerWidth * 0.35, 250);
                  const x = radius + Math.cos(angle) * radius;
                  const y = radius + Math.sin(angle) * radius;

                  return (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
                      style={{
                        left: `${(x / (radius * 2)) * 100}%`,
                        top: `${(y / (radius * 2)) * 100}%`,
                        opacity: 0,
                        animation: 'fadeIn 0.5s ease-out forwards',
                      }}
                    >
                      <div
                        className="w-5 h-5 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white transition-all duration-500"
                        style={{
                          backgroundColor: node.color,
                          transform: 'scale(0)',
                          animation: 'scaleIn 0.5s ease-out forwards',
                        }}
                      >
                        <Server className="w-3 h-3 md:w-4 md:h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Data distribution section */}
          <div className="mt-6 md:mt-8">
            <h2 className="text-base md:text-xl font-semibold mb-4 px-2">Data Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {nodes.map((node) => {
                const nodeData = dataPoints.filter((dp) => dp.color === node.color);
                return (
                  <div
                    key={node.id}
                    className="p-2 md:p-4 rounded-lg transition-all duration-500 ease-in-out"
                    style={{
                      backgroundColor: node.color + '15',
                      opacity: 0,
                      animation: 'fadeIn 0.5s ease-out forwards',
                    }}
                  >
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                      <div
                        className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: node.color }}
                      />
                      <h3 className="font-semibold text-xs md:text-base truncate">{node.id}</h3>
                      <span className="text-xs md:text-sm text-gray-600 flex-shrink-0">
                        ({nodeData.length})
                      </span>
                    </div>
                    <div className="text-xs md:text-sm space-y-0.5">
                      {nodeData.slice(-2).map((dp) => (
                        <div key={dp.key} className="text-gray-600 truncate">
                          {dp.key}: {dp.value}
                        </div>
                      ))}
                      {nodeData.length > 2 && (
                        <div className="text-gray-400 text-xs">
                          +{nodeData.length - 2} more...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;