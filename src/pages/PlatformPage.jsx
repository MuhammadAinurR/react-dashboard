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
  const [selectedImage, setSelectedImage] = useState(null);
  const [formStep, setFormStep] = useState(1);

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
        limitPrice: parseFloat(data.limitPrice),
        url: data.url || "",
        imageUrl: data.imageUrl || "",
        titleImageUrl: data.titleImageUrl || "",
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

  const nextStep = () => setFormStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setFormStep((prev) => Math.max(prev - 1, 1));

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
      setFormStep(1);
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
            <DialogContent className="max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Add New Platform</DialogTitle>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <div className={`flex items-center ${formStep === 1 ? "text-primary" : "text-muted-foreground"}`}>
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2
                      ${formStep === 1 ? "border-primary bg-primary/10" : "border-muted"}`}
                    >
                      1
                    </div>
                    <span className="text-sm">Basic Info</span>
                  </div>
                  <div className="h-[2px] w-12 bg-muted" />
                  <div className={`flex items-center ${formStep === 2 ? "text-primary" : "text-muted-foreground"}`}>
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2
                      ${formStep === 2 ? "border-primary bg-primary/10" : "border-muted"}`}
                    >
                      2
                    </div>
                    <span className="text-sm">Pricing</span>
                  </div>
                  <div className="h-[2px] w-12 bg-muted" />
                  <div className={`flex items-center ${formStep === 3 ? "text-primary" : "text-muted-foreground"}`}>
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2
                      ${formStep === 3 ? "border-primary bg-primary/10" : "border-muted"}`}
                    >
                      3
                    </div>
                    <span className="text-sm">Media</span>
                  </div>
                </div>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-6 mt-4">
                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={addForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Platform Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter platform name" {...field} />
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
                              <FormLabel>Display Label*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter display label" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={addForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platform URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Rewards</h3>
                          <FormField
                            control={addForm.control}
                            name="cashback"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cashback (%)</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
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
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium">Pricing</h3>
                          <FormField
                            control={addForm.control}
                            name="marketPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Market Price</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
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
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <FormField
                        control={addForm.control}
                        name="averageRebate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average Rebate</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Platform Images</h3>
                        <FormField
                          control={addForm.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo Image URL</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Input placeholder="https://example.com/logo.png" {...field} />
                                  {field.value && (
                                    <div className="w-20 h-20 rounded-lg overflow-hidden border">
                                      <img
                                        src={field.value}
                                        alt="Logo preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.style.display = "none")}
                                      />
                                    </div>
                                  )}
                                </div>
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
                                <div className="space-y-2">
                                  <Input placeholder="https://example.com/title.png" {...field} />
                                  {field.value && (
                                    <div className="w-40 h-20 rounded-lg overflow-hidden border">
                                      <img
                                        src={field.value}
                                        alt="Title preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.style.display = "none")}
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (formStep === 1) {
                          setIsAddDialogOpen(false);
                          setFormStep(1);
                        } else {
                          prevStep();
                        }
                      }}
                    >
                      {formStep === 1 ? "Cancel" : "Back"}
                    </Button>
                    {formStep < 3 ? (
                      <Button type="button" onClick={nextStep}>
                        Next Step
                      </Button>
                    ) : (
                      <Button type="submit">Create Platform</Button>
                    )}
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
                  <TableHead className="font-semibold">Image</TableHead>
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
                      <TableCell>
                        {platform.imageUrl ? (
                          <>
                            <div
                              className="relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setSelectedImage(platform.imageUrl)}
                            >
                              <img
                                src={platform.imageUrl}
                                alt={platform.name}
                                className="object-cover w-full h-full hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                            <Dialog
                              open={selectedImage === platform.imageUrl}
                              onOpenChange={() => setSelectedImage(null)}
                            >
                              <DialogContent className="max-w-3xl">
                                <img
                                  src={platform.imageUrl}
                                  alt={platform.name}
                                  className="w-full h-auto object-contain"
                                />
                              </DialogContent>
                            </Dialog>
                          </>
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </TableCell>
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
                                  <FormField
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
                                    control={editForm.control}
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
