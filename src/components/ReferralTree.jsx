import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function TreeNode({ node, rootUserId }) {
  if (!node) return null;

  const isCurrentUser = node.userId === rootUserId;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className={`p-2 border rounded-lg bg-muted ${isCurrentUser ? "border-green-500 border-2" : ""}`}>
        {node.userId}
        <div className="text-xs text-muted-foreground">{node.referralCode}</div>
      </div>
      {hasChildren && (
        <>
          {/* Vertical line with gradient and increased height */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-gray-300 to-gray-400" />
          {/* Container for horizontal line and children */}
          <div className="relative flex gap-12">
            {/* Horizontal line with gradient */}
            {node.children.length > 1 && (
              <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300"
                style={{ transform: "translateY(-1px)" }}
              />
            )}
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} rootUserId={rootUserId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ReferralTree({ isOpen, onClose, treeData, requestedUserId }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Referral Tree</DialogTitle>
        </DialogHeader>
        <div className="p-4 overflow-auto">
          <TreeNode node={treeData} rootUserId={requestedUserId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
