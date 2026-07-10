import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarCheck, CheckCircle2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBookInspection } from "@/lib/api-client";

const TIME_SLOTS = [
  { value: "morning", label: "Morning (8am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 4pm)" },
  { value: "evening", label: "Evening (4pm – 7pm)" },
];

const inspectionSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Phone number is required"),
  preferredDate: z.string().min(1, "Please choose a date"),
  preferredTime: z.string().min(1, "Please choose a time slot"),
  notes: z.string().optional(),
});

type InspectionFormValues = z.infer<typeof inspectionSchema>;

interface BookInspectionDialogProps {
  propertyId: number;
  propertyTitle: string;
}

export function BookInspectionDialog({
  propertyId,
  propertyTitle,
}: BookInspectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const bookInspection = useBookInspection();

  const today = new Date().toISOString().split("T")[0];

  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  function onSubmit(values: InspectionFormValues) {
    bookInspection.mutate(
      {
        data: {
          propertyId,
          name: values.name,
          email: values.email,
          phone: values.phone,
          preferredDate: values.preferredDate,
          preferredTime: values.preferredTime,
          notes: values.notes || null,
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: () => {
          toast({
            title: "Booking failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  }

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) {
      setTimeout(() => {
        setSubmitted(false);
        form.reset();
      }, 300);
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full h-11 rounded-xl border-primary/40 text-primary hover:bg-primary/5 hover:border-primary gap-2 font-semibold"
        onClick={() => setOpen(true)}
      >
        <CalendarCheck className="w-4 h-4" />
        Book Inspection
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2">
                  Inspection Booked!
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We've received your request and will confirm the inspection
                  details via email shortly.
                </p>
              </div>
              <Button
                className="mt-2 rounded-xl"
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <DialogTitle className="font-serif text-xl">
                    Book an Inspection
                  </DialogTitle>
                </div>
                <DialogDescription className="text-sm leading-relaxed">
                  Schedule a viewing for{" "}
                  <span className="font-medium text-foreground">
                    {propertyTitle}
                  </span>
                  . The agent will confirm your preferred slot.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-2"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel className="text-xs font-medium">
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Amaka Obi"
                              className="bg-muted/50 border-transparent focus-visible:bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@email.com"
                              className="bg-muted/50 border-transparent focus-visible:bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+234 ..."
                              className="bg-muted/50 border-transparent focus-visible:bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Preferred Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={today}
                              className="bg-muted/50 border-transparent focus-visible:bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium">
                            Time Slot
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-muted/50 border-transparent focus:bg-background">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIME_SLOTS.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>
                                  {slot.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">
                          Notes{" "}
                          <span className="text-muted-foreground font-normal">
                            (optional)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any specific areas you'd like to see, accessibility needs, etc."
                            className="min-h-[80px] bg-muted/50 border-transparent focus-visible:bg-background resize-none text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl text-base"
                    disabled={bookInspection.isPending}
                  >
                    {bookInspection.isPending
                      ? "Booking..."
                      : "Confirm Inspection"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
