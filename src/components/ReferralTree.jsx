import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useEffect } from "react";

// Custom Node Component
function CustomNode({ data }) {
  return (
    <div className={`p-2 border rounded-lg bg-muted ${data.isCurrentUser ? "border-green-500 border-2" : ""}`}>
      <div>{data.userId}</div>
      <div className="text-xs text-muted-foreground">{data.referralCode}</div>
    </div>
  );
}

// Node types definition
const nodeTypes = {
  custom: CustomNode,
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
        position,
        type: "custom",
        data: {
          userId: tree.userId,
          referralCode: tree.referralCode,
          isCurrentUser: tree.userId === requestedUserId,
        },
      };
      nodes.push(currentNode);

      // Create edge if there's a parent
      if (parentId) {
        edges.push({
          id: `${parentId}-${tree.userId}`,
          source: parentId.toString(),
          target: tree.userId.toString(),
          type: "smoothstep",
          style: {
            stroke: "#FF0000", // Bright red color for testing
            strokeWidth: 5, // Very thick line
          },
          animated: true,
          markerEnd: {
            type: "arrow", // Add arrow at the end
            color: "#FF0000",
          },
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
            fitView
            defaultEdgeOptions={{
              style: {
                strokeWidth: 5, // Make lines very thick
                stroke: "#FF0000", // Bright red color
              },
              animated: true,
              type: "smoothstep",
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
