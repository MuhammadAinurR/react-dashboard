import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  getBezierPath,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect } from "react";

// Custom Node Component
function CustomNode({ data, isConnectable }) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div className={`p-2 border rounded-lg bg-muted ${data.isCurrentUser ? "border-green-500 border-2" : ""}`}>
        <div>{data.userId}</div>
        <div className="text-xs text-muted-foreground">{data.referralCode}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </>
  );
}

// Custom Edge Component
function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return <path id={id} d={path} style={{ stroke: "black", strokeWidth: 2 }} />;
}

// Node types definition
const nodeTypes = {
  custom: CustomNode,
};

// Edge types definition
const edgeTypes = {
  custom: CustomEdge,
};

export function ReferralTree({ isOpen, onClose, treeData, requestedUserId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const convertTreeToFlow = useCallback(
    (tree, parentId = null, position = { x: 0, y: 0 }) => {
      if (!tree) return { nodes: [], edges: [] };

      const nodes = [];
      const edges = [];

      // Create node
      const currentNode = {
        id: tree.userId.toString(),
        position: { x: position.x, y: position.y },
        type: "custom",
        data: {
          userId: tree.userId,
          referralCode: tree.referralCode,
          isCurrentUser: tree.userId === requestedUserId,
          label: tree.userId,
        },
      };
      nodes.push(currentNode);

      // Create edge if there's a parent
      if (parentId) {
        edges.push({
          id: `${parentId}-${tree.userId}`,
          source: parentId.toString(),
          target: tree.userId.toString(),
        });
      }

      // Process children with adjusted spacing
      if (tree.children) {
        const spacing = 200; // Increased horizontal spacing
        tree.children.forEach((child, index) => {
          const childPosition = {
            x: position.x + (index - (tree.children.length - 1) / 2) * spacing,
            y: position.y + 100, // Reduced vertical spacing
          };
          const { nodes: childNodes, edges: childEdges } = convertTreeToFlow(child, tree.userId, childPosition);
          nodes.push(...childNodes);
          edges.push(...childEdges);
        });
      }

      return { nodes, edges };
    },
    [requestedUserId]
  );

  useEffect(() => {
    if (treeData) {
      const { nodes: newNodes, edges: newEdges } = convertTreeToFlow(treeData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [treeData, convertTreeToFlow, setNodes, setEdges]);
  console.log("nodes", nodes);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[600px]">
        <DialogHeader>
          <DialogTitle>Referral Tree</DialogTitle>
        </DialogHeader>
        <div style={{ width: "100%", height: "500px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            defaultEdgeOptions={{
              animated: true,
              type: "straight",
            }}
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </DialogContent>
    </Dialog>
  );
}
