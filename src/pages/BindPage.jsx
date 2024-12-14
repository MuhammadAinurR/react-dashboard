import { useState, useEffect } from "react";
import { privateFetch } from "@/hooks/useFetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Trans } from "@lingui/react/macro";

export default function BindStatus() {
  const fetch = privateFetch();
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tempStatus, setTempStatus] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBindStatus = async (status, page = 1) => {
    try {
      const query = status && status !== "all" ? `?status=${status}&page=${page}` : `?page=${page}`;
      const res = await fetch(`/bind${query}`);
      const data = await res.json();
      setResponse(data.binds);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBindStatus(filterStatus, currentPage);
  }, [filterStatus, currentPage]);

  const updateBindStatus = async (bindingId, newStatus) => {
    try {
      await fetch(`/bind/${bindingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      fetchBindStatus(filterStatus, currentPage);
      setTempStatus({});
    } catch (err) {
      setError(err);
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
          <Trans>Bind Status</Trans>
        </CardTitle>
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <Trans>All Status</Trans>
            </SelectItem>
            <SelectItem value="approved">
              <Trans>Approved</Trans>
            </SelectItem>
            <SelectItem value="pending">
              <Trans>Pending</Trans>
            </SelectItem>
            <SelectItem value="reject">
              <Trans>Rejected</Trans>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>
            <Trans>Loading...</Trans>
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">
                    <Trans>Platform</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>User ID</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>UID</Trans>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <Trans>Status</Trans>
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    <Trans>Actions</Trans>
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
                  response.map((binding, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{binding.platformName}</TableCell>
                      <TableCell className="font-mono text-sm">{binding.userId}</TableCell>
                      <TableCell className="font-mono text-sm">{binding.uid}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            binding.isBind === "approved"
                              ? "bg-green-100 text-green-800"
                              : binding.isBind === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {binding.isBind === "approved"
                            ? "Approved"
                            : binding.isBind === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trans>Change Status</Trans>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                <Trans>Update Bind Status</Trans>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <Select
                                defaultValue={binding.isBind}
                                onValueChange={(value) => setTempStatus({ ...tempStatus, [binding.id]: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approved">
                                    <Trans>Approved</Trans>
                                  </SelectItem>
                                  <SelectItem
                                    value="pending"
                                    disabled={binding.isBind === "pending"}
                                    className="hidden"
                                  >
                                    <Trans>Pending</Trans>
                                  </SelectItem>
                                  <SelectItem value="reject">
                                    <Trans>Rejected</Trans>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => updateBindStatus(binding.id, tempStatus[binding.id] || binding.isBind)}
                              >
                                <Trans>Update</Trans>
                              </Button>
                            </DialogTrigger>
                          </DialogContent>
                        </Dialog>
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
