import { useState, useEffect } from "react";
import { privateFetch } from "@/hooks/useFetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Trans } from "@lingui/react/macro";
import { formatToUSD } from "@/utils/formater";

export default function UserPlatformWalletPage() {
  const fetch = privateFetch();
  const [response, setResponse] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async (page = 1) => {
    try {
      const query = `?page=${page}`;
      const res = await fetch(`/platform-transaction${query}`);
      const data = await res.json();
      console.log(data);
      setResponse(data.platformTransactions);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

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
          <Trans>User Platform Wallet</Trans>
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
                    <Trans>Platform</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Balance</Trans>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {response.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <Trans>No data</Trans>
                    </TableCell>
                  </TableRow>
                ) : (
                  response.map((data, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{data.userId}</TableCell>
                      <TableCell className="font-medium">{data.platformName}</TableCell>
                      <TableCell className="font-mono text-sm">{formatToUSD(data.balance)}</TableCell>
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
