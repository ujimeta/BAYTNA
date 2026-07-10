import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useSubmitProperty } from "@/lib/api-client";
import { PropertyImageUploader } from "@/components/property/PropertyImageUploader";

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara",
];

const COMMON_FEATURES = [
  "Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security",
  "Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning",
  "Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace",
  "Borehole / Water Tank","Solar Power","Gym / Fitness Centre","Elevator/Lift",
];

const schema = z.object({
  title: z.string().min(5, "Enter a descriptive title"),
  description: z.string().min(30, "Please write at least 30 characters"),
  propertyType: z.enum(["house","condo","townhouse","loft","land"]),
  listingType: z.enum(["sale","rent","shortlet"]),
  price: z.coerce.number().positive("Enter a valid price"),
  beds: z.coerce.number().int().min(0, "Min 0"),
  baths: z.coerce.number().min(0, "Min 0"),
  sqft: z.coerce.number().int().positive("Enter approximate size"),
  address: z.string().min(5, "Enter a street address"),
  city: z.string().min(2, "Enter the city"),
  state: z.string().min(2, "Select a state"),
  features: z.array(z.string()),
  agentName: z.string().min(2, "Enter your full name"),
  agentPhone: z.string().min(10, "Enter a valid phone number"),
  agentEmail: z.string().email("Enter a valid email").or(z.literal("")).optional(),
  agentAgency: z.string().optional(),
  agentTitle: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = ["Property Details", "Location", "Photos & Features", "Your Details"];

export default function SubmitListing() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);

  // Image state managed outside react-hook-form (controlled by the uploader component)
  const [uploadedImagePaths, setUploadedImagePaths] = useState<string[]>([]);

  const { mutate: submit, isPending } = useSubmitProperty();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyType: "house",
      listingType: "sale",
      beds: 3,
      baths: 2,
      sqft: 0,
      price: 0,
      state: "Lagos",
      features: [],
      agentEmail: "",
      agentAgency: "",
      agentTitle: "",
    },
  });

  const { watch, setValue, register, formState: { errors }, trigger } = form;
  const selectedFeatures = watch("features");
  const listingType = watch("listingType");
  const propertyType = watch("propertyType");

  const toggleFeature = (feature: string) => {
    const current = selectedFeatures ?? [];
    if (current.includes(feature)) {
      setValue("features", current.filter(f => f !== feature));
    } else {
      setValue("features", [...current, feature]);
    }
  };

  const nextStep = async () => {
    const fieldsPerStep: (keyof FormData)[][] = [
      ["title","description","propertyType","listingType","price","beds","baths","sqft"],
      ["address","city","state"],
      [],
      ["agentName","agentPhone"],
    ];
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep(s => s + 1);
  };

  const onSubmit = (data: FormData) => {
    const coverImage = uploadedImagePaths[0] ?? "";
    const images = uploadedImagePaths.slice(1);

    const payload = {
      ...data,
      price: Number(data.price),
      beds: Number(data.beds),
      baths: Number(data.baths),
      sqft: Number(data.sqft),
      zip: "000000",
      coverImage,
      images,
      features: data.features,
      agentEmail: data.agentEmail || "",
      agentAgency: data.agentAgency || "",
      agentTitle: data.agentTitle || "",
    };
    submit(
      { data: payload },
      {
        onSuccess: (res) => {
          setSubmittedId(res.id);
          setSubmitted(true);
        },
      }
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-semibold mb-3">Listing Submitted!</h1>
          <p className="text-muted-foreground leading-relaxed mb-2">
            Your listing has been received and is pending review by the Baytna team.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            We typically review listings within 24 hours. You'll be contacted on the phone number you provided once it goes live.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/browse">Browse Other Listings</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Submit a Listing"
        description="List your property on Baytna — Nigeria's trusted property marketplace."
      />

      {/* Step header */}
      <div className="border-b bg-background sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/list-property" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border text-[10px] flex items-center justify-center font-bold shrink-0"
                    style={{ borderColor: i <= step ? "currentColor" : undefined }}>
                    {i < step ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
              </div>
            ))}
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>

          {/* STEP 0 — Property Details */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-1">Property Details</h2>
                <p className="text-muted-foreground text-sm">Tell us about the property you're listing.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Property Type</Label>
                  <Select value={propertyType} onValueChange={v => setValue("propertyType", v as FormData["propertyType"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="loft">Loft</SelectItem>
                      <SelectItem value="land">Landed Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Listing Type</Label>
                  <Select value={listingType} onValueChange={v => setValue("listingType", v as FormData["listingType"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="shortlet">Short Let</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Listing Title</Label>
                <Input {...register("title")} placeholder="e.g. 4-Bedroom Detached Duplex in Lekki Phase 1" />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Price (₦)</Label>
                <Input {...register("price")} type="number" min={0} placeholder="e.g. 45000000" />
                {errors.price && <p className="text-destructive text-xs">{errors.price.message}</p>}
                <p className="text-xs text-muted-foreground">
                  {listingType === "rent" ? "Annual rent in Naira" : listingType === "shortlet" ? "Per night in Naira" : "Sale price in Naira"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Bedrooms</Label>
                  <Input {...register("beds")} type="number" min={0} placeholder="3" />
                  {errors.beds && <p className="text-destructive text-xs">{errors.beds.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Bathrooms</Label>
                  <Input {...register("baths")} type="number" min={0} step={0.5} placeholder="2" />
                  {errors.baths && <p className="text-destructive text-xs">{errors.baths.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Size (sqft)</Label>
                  <Input {...register("sqft")} type="number" min={0} placeholder="2500" />
                  {errors.sqft && <p className="text-destructive text-xs">{errors.sqft.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  {...register("description")}
                  rows={5}
                  placeholder="Describe the property — its features, what makes it special, the neighbourhood, nearby landmarks, etc."
                  className="resize-none"
                />
                {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
              </div>
            </div>
          )}

          {/* STEP 1 — Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-1">Location</h2>
                <p className="text-muted-foreground text-sm">Where is the property located?</p>
              </div>

              <div className="space-y-1.5">
                <Label>Street Address</Label>
                <Input {...register("address")} placeholder="e.g. 14 Admiralty Way" />
                {errors.address && <p className="text-destructive text-xs">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City / Area</Label>
                  <Input {...register("city")} placeholder="e.g. Lekki Phase 1" />
                  {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Select value={watch("state")} onValueChange={v => setValue("state", v)}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_STATES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-destructive text-xs">{errors.state.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Photos & Features */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-1">Photos & Features</h2>
                <p className="text-muted-foreground text-sm">Upload photos from your device and tick the amenities that apply.</p>
              </div>

              <PropertyImageUploader
                label="Property Photos"
                hint="The first photo will be used as the cover image. Upload up to 9 photos — clear, well-lit shots get far more enquiries."
                maxFiles={9}
                onImagesChange={setUploadedImagePaths}
              />

              {/* Features */}
              <div className="space-y-3">
                <Label>Amenities & Features</Label>
                <div className="grid grid-cols-2 gap-3">
                  {COMMON_FEATURES.map(feature => (
                    <div key={feature} className="flex items-center gap-2 cursor-pointer" onClick={() => toggleFeature(feature)}>
                      <Checkbox checked={selectedFeatures?.includes(feature)} onCheckedChange={() => toggleFeature(feature)} id={feature} />
                      <label htmlFor={feature} className="text-sm cursor-pointer select-none">{feature}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Agent Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-1">Your Details</h2>
                <p className="text-muted-foreground text-sm">So buyers can reach you, and we can contact you once your listing is approved.</p>
              </div>

              <div className="space-y-1.5">
                <Label>Full Name <span className="text-destructive">*</span></Label>
                <Input {...register("agentName")} placeholder="e.g. Amaka Okonkwo" />
                {errors.agentName && <p className="text-destructive text-xs">{errors.agentName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Phone / WhatsApp Number <span className="text-destructive">*</span></Label>
                <Input {...register("agentPhone")} placeholder="+234 801 234 5678" />
                {errors.agentPhone && <p className="text-destructive text-xs">{errors.agentPhone.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Email Address (optional)</Label>
                <Input {...register("agentEmail")} type="email" placeholder="you@example.com" />
                {errors.agentEmail && <p className="text-destructive text-xs">{errors.agentEmail.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Agency / Company (optional)</Label>
                  <Input {...register("agentAgency")} placeholder="e.g. Lagos Realty Ltd" />
                </div>
                <div className="space-y-1.5">
                  <Label>Your Title (optional)</Label>
                  <Input {...register("agentTitle")} placeholder="e.g. Senior Listing Agent" />
                </div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-4 text-sm text-muted-foreground leading-relaxed">
                By submitting this listing, you confirm that you are the agent, owner, or authorised representative of this property, and that all details provided are accurate. Your listing will be reviewed by the Baytna team before going live.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(s => s - 1)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} className="rounded-full px-8">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isPending} className="rounded-full px-8 gap-2">
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit Listing"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
