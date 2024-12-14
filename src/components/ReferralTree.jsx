import { useState, useEffect, useRef, useCallback } from "react";
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
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "./ui/button";

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
      <Handle type="source" position={Position.Bottomt} id="b" isConnectable={isConnectable} />
    </>
  );
}

function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return <path id={id} d={path} style={{ stroke: "black", strokeWidth: 2 }} />;
}

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export function ReferralTree({
  isOpen,
  onClose,
  treeData,
  requestedUserId,
  increaseTopLevelTree,
  increaseBottomLevelTree,
  treeLevel,
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const convertTreeToFlow = useCallback(
    (tree, parentId = null, position = { x: 0, y: 0 }) => {
      if (!tree) return { nodes: [], edges: [] };

      const nodes = [];
      const edges = [];

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

      if (parentId) {
        edges.push({
          id: `${parentId}-${tree.userId}`,
          source: parentId.toString(),
          target: tree.userId.toString(),
        });
      }

      if (tree.children) {
        const spacing = 200;
        tree.children.forEach((child, index) => {
          const childPosition = {
            x: position.x + (index - (tree.children.length - 1) / 2) * spacing,
            y: position.y + 100,
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
    if (isOpen && treeData) {
      const { nodes: newNodes, edges: newEdges } = convertTreeToFlow(treeData);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [isOpen, treeData, convertTreeToFlow]);

  useEffect(() => {
    if (isOpen && nodes.length > 0) {
      // Trigger fitView after the tree data is loaded
      fitView();
    }
  }, [isOpen, nodes, fitView, treeData]);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-5xl h-[600px]">
        <DialogHeader>
          <div className="flex w-full justify-between pr-4">
            <DialogTitle>Referral Tree</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={increaseTopLevelTree}>Expand top level</Button>
              <Button onClick={increaseBottomLevelTree}>Expand bottom level</Button>
            </div>
          </div>
        </DialogHeader>
        <div style={{ width: "100%", height: "500px" }}>
          {isOpen && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView={false} // Disable automatic fitView to manage it manually
              defaultEdgeOptions={{
                animated: true,
                type: "straight",
              }}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
