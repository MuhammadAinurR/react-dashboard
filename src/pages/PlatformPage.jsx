import { useState, useEffect } from "react";
import { privateFetch } from "@/hooks/useFetch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const platformFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  cashback: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).optional(),
  averageRebate: z.coerce.number().min(0).optional(),
  limitPrice: z.coerce.number().min(0).optional(),
  marketPrice: z.coerce.number().min(0).optional(),
  url: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  titleImageUrl: z.string().url().optional(),
});

export default function PlatformPage() {
  const fetch = privateFetch();
  const [platforms, setPlatforms] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformToDelete, setPlatformToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [platformToEdit, setPlatformToEdit] = useState(null);
  const { toast } = useToast();

  const addForm = useForm({
    resolver: zodResolver(platformFormSchema),
    defaultValues: {
      name: "",
      label: "",
      cashback: 0,
      discount: 0,
      averageRebate: 0,
      limitPrice: 0,
      marketPrice: 0,
      url: "",
      imageUrl: "",
      titleImageUrl: "",
    },
  });

  const editForm = useForm({
    resolver: zodResolver(platformFormSchema),
    defaultValues: {
      name: "",
      label: "",
      cashback: 0,
      discount: 0,
      averageRebate: 0,
      limitPrice: 0,
      marketPrice: 0,
      url: "",
      imageUrl: "",
      titleImageUrl: "",
    },
  });

  const fetchPlatforms = async (page = 1, search = "") => {
    try {
      const query = `?page=${page}&limit=10${search ? `&search=${search}` : ""}`;
      const res = await fetch(`/platforms${query}`);
      const data = await res.json();
      setPlatforms(data.rows);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlatforms(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleDelete = async () => {
    if (!platformToDelete) return;

    try {
      await fetch(`/platforms/${platformToDelete}`, {
        method: "DELETE",
      });
      fetchPlatforms(currentPage, searchQuery);
    } catch (err) {
      setError(err);
    } finally {
      setPlatformToDelete(null);
    }
  };

  const handleEdit = async (data) => {
    try {
      const formattedData = {
        ...data,
        cashback: parseFloat(data.cashback),
        discount: parseFloat(data.discount),
        averageRebate: parseFloat(data.averageRebate),
        marketPrice: parseFloat(data.marketPrice),
      };

      await fetch(`/platforms/${platformToEdit.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      await fetchPlatforms(currentPage, searchQuery);
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Platform updated successfully",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update platform",
        variant: "destructive",
      });
      setError(err);
    }
  };

  const handleEditClick = (platform) => {
    editForm.reset(platform);
    setPlatformToEdit(platform);
    setIsEditDialogOpen(true);
  };

  const handleAdd = async (data) => {
    try {
      const formattedData = {
        ...data,
        cashback: data.cashback ? parseFloat(data.cashback) : 0,
        discount: data.discount ? parseFloat(data.discount) : null,
        averageRebate: data.averageRebate ? parseFloat(data.averageRebate) : 0,
        marketPrice: data.marketPrice ? parseFloat(data.marketPrice) : 0,
        limitPrice: data.limitPrice ? parseFloat(data.limitPrice) : 0,
        url: data.url || "",
        imageUrl: data.imageUrl || "",
        titleImageUrl: data.titleImageUrl || "",
      };

      const response = await fetch("/platforms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create platform: ${response.status}`);
      }

      await fetchPlatforms(currentPage, searchQuery);
      setIsAddDialogOpen(false);
      addForm.reset();
      toast({
        title: "Success",
        description: "Platform created successfully",
        variant: "success",
      });
    } catch (err) {
      console.error("Creation error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create platform",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error: {error.message || error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Platforms</CardTitle>
        <div className="flex gap-4">
          <Input
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Platform</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Platform</DialogTitle>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="cashback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cashback (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="averageRebate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avg. Rebate</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="marketPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="limitPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limit Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="titleImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Platform</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Label</TableHead>
                  <TableHead className="font-semibold">Cashback (%)</TableHead>
                  <TableHead className="font-semibold">Discount (%)</TableHead>
                  <TableHead className="font-semibold">Avg. Rebate</TableHead>
                  <TableHead className="font-semibold">Market Price</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platforms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No platforms found
                    </TableCell>
                  </TableRow>
                ) : (
                  platforms.map((platform) => (
                    <TableRow key={platform.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{platform.name}</TableCell>
                      <TableCell>{platform.label}</TableCell>
                      <TableCell>{platform.cashback}</TableCell>
                      <TableCell>{platform.discount || "-"}</TableCell>
                      <TableCell>{platform.averageRebate}</TableCell>
                      <TableCell>{platform.marketPrice}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditClick(platform)}>
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Platform</DialogTitle>
                              </DialogHeader>
                              <Form {...editForm}>
                                <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                                  <FormField
                                    control={editForm.control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="label"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="cashback"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Cashback (%)</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="discount"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Discount (%)</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="averageRebate"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Avg. Rebate</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="marketPrice"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Market Price</FormLabel>
                                        <FormControl>
                                          <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button type="submit">Save Changes</Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog
                            open={platformToDelete === platform.id}
                            onOpenChange={(open) => !open && setPlatformToDelete(null)}
                          >
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" onClick={() => setPlatformToDelete(platform.id)}>
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete {platform.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the platform.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {platforms.length > 0 && (
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
