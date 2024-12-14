import { useState, useEffect } from "react";
import { privateFetch } from "@/hooks/useFetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ReferralTree } from "@/components/ReferralTree";
import { Trans } from "@lingui/react/macro";

export default function ReferralCodesPage() {
  const fetch = privateFetch();
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeModalOpen, setTreeModalOpen] = useState(false);
  const [requestedUserId, setRequestedUserId] = useState(null);

  const fetchReferralCodes = async (page = 1) => {
    try {
      const res = await fetch(`/referral-codes?page=${page}`);
      const data = await res.json();
      setResponse(data.data || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setResponse([]);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReferralTree = async (userId) => {
    try {
      setRequestedUserId(userId);
      const res = await fetch(`/referral-codes/tree/${userId}`);
      const data = await res.json();
      setSelectedTree(data);
      setTreeModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReferralCodes(currentPage);
  }, [currentPage]);

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>
            <Trans>Referral Codes</Trans>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            <Trans>Error: {error.message || error}</Trans>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>
          <Trans>Referral Codes</Trans>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Trans>Loading...</Trans>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">
                    <Trans>User ID</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Referral Code</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Referred By</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Actions</Trans>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!response || response.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No data
                    </TableCell>
                  </TableRow>
                ) : (
                  response.map((referral, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{referral.userId}</TableCell>
                      <TableCell className="font-mono text-sm">{referral.referralCode}</TableCell>
                      <TableCell className="font-mono text-sm">{referral.referredBy}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => fetchReferralTree(referral.userId)}>
                          View Tree
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {response && response.length > 0 && (
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </>
        )}
      </CardContent>
      <ReferralTree
        isOpen={treeModalOpen}
        onClose={() => setTreeModalOpen(false)}
        treeData={selectedTree}
        requestedUserId={requestedUserId}
      />
    </Card>
  );
}
