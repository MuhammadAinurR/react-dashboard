import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Trans } from "@lingui/react/macro";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { useState, useEffect } from "react";

export function ReferralTree({
  isOpen,
  onClose,
  treeData,
  requesteduserEmail,
  increaseTopLevelTree,
  increaseBottomLevelTree,
  treeLevel,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Auto-expand when new data is loaded
  useEffect(() => {
    if (treeData?.tree) {
      const nodesToExpand = new Set(expandedNodes);
      
      const expandNewNodes = (node) => {
        if (!node) return;
        
        // If this is a newly loaded node (has children), expand it
        if (node.children && node.children.length > 0) {
          nodesToExpand.add(node.userEmail);
        }

        // Recursively check children
        if (node.children) {
          node.children.forEach(child => expandNewNodes(child));
        }
      };

      expandNewNodes(treeData.tree);
      setExpandedNodes(nodesToExpand);
    }
  }, [treeData]);

  const handleIncreaseTopLevel = async () => {
    setIsLoadingMore(true);
    await increaseTopLevelTree();
    setIsLoadingMore(false);
  };

  const handleIncreaseBottomLevel = async () => {
    setIsLoadingMore(true);
    await increaseBottomLevelTree();
    setIsLoadingMore(false);
  };

  const toggleNode = (userEmail) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userEmail)) {
        newSet.delete(userEmail);
      } else {
        newSet.add(userEmail);
      }
      return newSet;
    });
  };

  const renderTreeNode = (node, level = 0, isFirst = false, isLast = false) => {
    if (!node) return null;
    const isExpanded = expandedNodes.has(node.userEmail);
    const hasChildren = node.children && node.children.length > 0;
    const hasHiddenChildren = node.hasMoreChildren;

    return (
      <>
        {isFirst && treeData.hasMoreAncestors && (
          <div 
            className={`flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg cursor-pointer text-muted-foreground
              ${isLoadingMore ? 'opacity-50' : ''}`}
            onClick={handleIncreaseTopLevel}
          >
            {isLoadingMore ? (
              <span className="animate-spin">⌛</span>
            ) : (
              <ChevronRight size={16} />
            )}
            <span>...</span>
          </div>
        )}
        <div key={node.userEmail} style={{ marginLeft: `${level * 24}px` }}>
          <div 
            className={`flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg cursor-pointer ${
              node.userEmail === requesteduserEmail ? "border-green-500 border-2" : ""
            }`}
            onClick={() => hasChildren && toggleNode(node.userEmail)}
          >
            {(hasChildren || hasHiddenChildren) && (
              <span className="text-muted-foreground">
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
            <User size={16} className="text-muted-foreground" />
            <div>
              <div className="font-medium">{node.userEmail}</div>
              <div className="text-xs text-muted-foreground">{node.referralCode}</div>
            </div>
          </div>
          {isExpanded && hasChildren && (
            <div className="border-l-2 border-muted ml-3 pl-3">
              {node.children.map((child, index) => 
                renderTreeNode(
                  child, 
                  level + 1, 
                  false, 
                  index === node.children.length - 1
                )
              )}
            </div>
          )}
          {hasHiddenChildren && (
            <div 
              className={`flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg cursor-pointer text-muted-foreground ml-8
                ${isLoadingMore ? 'opacity-50' : ''}`}
              onClick={handleIncreaseBottomLevel}
            >
              {isLoadingMore ? (
                <span className="animate-spin">⌛</span>
              ) : (
                <ChevronRight size={16} />
              )}
              <span>...</span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            <Trans>Referral Tree</Trans>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          {treeData?.tree && renderTreeNode(treeData.tree, 0, true)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
