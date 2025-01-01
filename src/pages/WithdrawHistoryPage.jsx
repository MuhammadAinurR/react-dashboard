import { useState, useEffect } from "react";
import { privateFetch } from "@/hooks/useFetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Trans } from "@lingui/react/macro";
import { formatToUSD } from "@/utils/formater";
import { Badge } from "@/components/ui/badge";

export default function WithdrawHistoryPage() {
  const fetch = privateFetch();
  const [response, setResponse] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async (page = 1) => {
    try {
      const query = `?page=${page}`;
      const res = await fetch(`/withdraw${query}`);
      const data = await res.json();
      
      if (!data || !data.withdrawData) {
        throw new Error('Invalid response format');
      }
      
      setResponse(data.withdrawData);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (error) {
      setError(error);
      setResponse([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>
            <Trans>Bind Status</Trans>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Trans>Withdraw History</Trans>
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
                    <Trans>Amount</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Network</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Type</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Date</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Status</Trans>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {response.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      <Trans>No data</Trans>
                    </TableCell>
                  </TableRow>
                ) : (
                  response.map((data) => (
                    <TableRow key={data.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{data.userId}</TableCell>
                      <TableCell className="font-mono text-sm">{formatToUSD(data.amount)}</TableCell>
                      <TableCell>{data.network || '-'}</TableCell>
                      <TableCell>
                        {data.type === 'EARN' ? 'Platform => Wallet' : 'Wallet => Cash'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {new Date(data.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(data.status)}>
                          {data.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {response.length > 0 && (
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
