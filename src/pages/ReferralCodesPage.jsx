import { useState, useEffect } from "react";
import { privateFetch } from "@/hooks/useFetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";

export default function ReferralCodesPage() {
  const fetch = privateFetch();
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    fetchReferralCodes(currentPage);
  }, [currentPage]);

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Referral Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error: {error.message || error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Referral Codes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">User ID</TableHead>
                  <TableHead className="font-semibold">Referral Code</TableHead>
                  <TableHead className="font-semibold">Referred By</TableHead>
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
    </Card>
  );
}
