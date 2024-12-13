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
import { Textarea } from "@/components/ui/textarea";
import { toast, useToast } from "@/hooks/use-toast";
import { eventsApi } from "@/services/api/events";
import { Trans } from "@lingui/react/macro";

const ITEMS_PER_PAGE = 10;

const useEventOperations = (fetch) => {
  const api = eventsApi(fetch);
  const { toast } = useToast();

  const handleApiError = (error, customMessage) => {
    toast({
      title: "Error",
      description: error.message || customMessage,
      variant: "destructive",
    });
    return error;
  };

  const handleSuccess = (message) => {
    toast({
      title: "Success",
      description: message,
      variant: "success",
    });
  };

  return {
    fetchEvents: async (page, search) => {
      try {
        const data = await api.getEvents(page, search);
        return {
          events: data.rows,
          totalPages: Math.ceil(data.count / ITEMS_PER_PAGE),
        };
      } catch (error) {
        throw handleApiError(error, "Failed to fetch events");
      }
    },

    deleteEvent: async (eventId) => {
      try {
        await api.deleteEvent(eventId);
        handleSuccess("Event deleted successfully");
      } catch (error) {
        throw handleApiError(error, "Failed to delete event");
      }
    },

    updateEvent: async (eventId, data) => {
      try {
        await api.updateEvent(eventId, data);
        handleSuccess("Event updated successfully");
      } catch (error) {
        throw handleApiError(error, "Failed to update event");
      }
    },

    createEvent: async (data) => {
      try {
        await api.createEvent(data);
        handleSuccess("Event created successfully");
      } catch (error) {
        throw handleApiError(error, "Failed to create event");
      }
    },
  };
};

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().min(1, "Subtitle is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  url: z.string().min(1, "URL is required"),
  language: z.string().min(1, "Language is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  tags: z.string().optional(),
});

export default function EventPage() {
  const fetch = privateFetch();
  const eventOperations = useEventOperations(fetch);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      imageUrl: "",
      url: "",
      language: "",
      startDate: "",
      endDate: "",
      tags: "",
    },
  });

  const addEventForm = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      imageUrl: "",
      url: "",
      language: "",
      startDate: "",
      endDate: "",
      tags: "",
    },
  });

  const fetchEvents = async (page = 1, search = "") => {
    try {
      const data = await eventOperations.fetchEvents(page, search);
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err);
      toast({
        title: "Error",
        description: err.message || "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleDelete = async () => {
    if (!eventToDelete) return;

    try {
      await eventOperations.deleteEvent(eventToDelete);
      await fetchEvents(currentPage, searchQuery);
    } catch (err) {
      setError(err);
    } finally {
      setEventToDelete(null);
    }
  };

  const handleEdit = async (data) => {
    try {
      await eventOperations.updateEvent(eventToEdit.id, data);
      await fetchEvents(currentPage, searchQuery);
      setIsEditDialogOpen(false);
    } catch (err) {
      setError(err);
    }
  };

  const handleEditClick = (event) => {
    form.reset({
      title: event.title,
      subTitle: event.subTitle,
      imageUrl: event.imageUrl,
      url: event.url,
      language: event.language,
      startDate: new Date(event.startDate).toISOString().split("T")[0],
      endDate: new Date(event.endDate).toISOString().split("T")[0],
      tags: event.tags.join(", "),
    });
    setEventToEdit(event);
    setIsEditDialogOpen(true);
  };

  const handleAdd = async (data) => {
    try {
      await eventOperations.createEvent(data);
      await fetchEvents(currentPage, searchQuery);
      setIsAddDialogOpen(false);
      addEventForm.reset();
    } catch (err) {
      setError(err);
    }
  };

  if (error) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Events</CardTitle>
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
        <CardTitle>Events</CardTitle>
        <div className="flex gap-4">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[250px]"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Trans>Add Event</Trans>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <Form {...addEventForm}>
                <form onSubmit={addEventForm.handleSubmit(handleAdd)} className="space-y-4">
                  <FormField
                    control={addEventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addEventForm.control}
                    name="subTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addEventForm.control}
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
                    control={addEventForm.control}
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
                    control={addEventForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={addEventForm.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addEventForm.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={addEventForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="tag1, tag2, tag3" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Event</Button>
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
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Language</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">End Date</TableHead>
                  <TableHead className="font-semibold">Tags</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No events found
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/50">
                      <TableCell>
                        {event.imageUrl ? (
                          <>
                            <div
                              className="relative w-16 h-12 rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setSelectedImage(event.imageUrl)}
                            >
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="object-cover w-full h-full hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                            <Dialog open={selectedImage === event.imageUrl} onOpenChange={() => setSelectedImage(null)}>
                              <DialogContent className="max-w-3xl">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-auto object-contain" />
                              </DialogContent>
                            </Dialog>
                          </>
                        ) : (
                          <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell>{event.language}</TableCell>
                      <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEditClick(event)}>
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Event</DialogTitle>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
                                  <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="subTitle"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
                                    name="language"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Language</FormLabel>
                                        <FormControl>
                                          <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="startDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Start Date</FormLabel>
                                          <FormControl>
                                            <Input type="date" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="endDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>End Date</FormLabel>
                                          <FormControl>
                                            <Input type="date" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <FormField
                                    control={form.control}
                                    name="tags"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tags (comma-separated)</FormLabel>
                                        <FormControl>
                                          <Input {...field} placeholder="tag1, tag2, tag3" />
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
                            open={eventToDelete === event.id}
                            onOpenChange={(open) => !open && setEventToDelete(null)}
                          >
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" onClick={() => setEventToDelete(event.id)}>
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete {event.title}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the event.
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
            {events.length > 0 && (
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
