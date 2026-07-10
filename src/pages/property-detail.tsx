import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import { useParams, Link } from "wouter";
import { MapPin, BedDouble, Bath, Square, Calendar, ArrowLeft, Heart, CheckCircle2, Star, BadgeCheck, Calculator, Moon, Video, Images } from "lucide-react";
import { PropertyVideoPlayer } from "@/components/property/PropertyVideoPlayer";
import { PropertyVideoUpload } from "@/components/property/PropertyVideoUpload";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, formatSqft } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "@/components/property/PropertyCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/hooks/use-session";
import {
  useGetProperty,
  useListSimilarProperties,
  useCreateInquiry,
  useAddFavorite,
  useRemoveFavorite,
  useListFavorites,
  getListFavoritesQueryKey,
  getGetPropertyQueryKey,
  getListSimilarPropertiesQueryKey,
} from "@/lib/api-client";
import { BookInspectionDialog } from "@/components/property/BookInspectionDialog";
import { useQueryClient } from "@tanstack/react-query";
import { SeoHead } from "@/components/SeoHead";

const PropertyMap = lazy(() =>
  import("@/components/property/PropertyMap").then((m) => ({ default: m.PropertyMap }))
);

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide a message"),
});

const CITY_TAGS: Record<string, string[]> = {
  Lagos: ["Near Lekki-Epe Expressway", "Close to VI", "Top schools nearby", "20 min to airport"],
  Abuja: ["Diplomatic Zone", "Near Transcorp Hilton", "Central Business District", "15 min to airport"],
  "Port Harcourt": ["Garden City", "Near GRA", "Close to Trans Amadi", "20 min to Port Harcourt Int'l"],
  Ibadan: ["University town", "Historic city centre", "Green & spacious", "Near Ibadan Zoo"],
  Enugu: ["Coal City", "Serene environment", "Close to Enugu Airport", "Easy highway access"],
  Kano: ["Ancient city walls", "Close to Kurmi Market", "Near Bayero University", "30 min to Mallam Aminu Kano Int'l"],
  Kaduna: ["Industrial hub", "Near NICON Golf Club", "Central Northern location", "Good road network"],
  Jos: ["Plateau cool climate", "Jos Wildlife Park nearby", "University of Jos", "Scenic highlands"],
  Zaria: ["Ahmadu Bello University", "Historic Emir's Palace", "Agricultural research hub", "Zaria Airport nearby"],
  Sokoto: ["Historic Caliphate city", "Waziri Junaidu Museum", "Near University of Sokoto", "Sadau Airport"],
};

const LISTING_LABELS: Record<string, string> = {
  sale: "For Sale",
  rent: "For Rent",
  shortlet: "Short Let",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function MortgageCalculator({ price }: { price: number }) {
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(18);
  const [years, setYears] = useState(20);

  const principal = price * (1 - down / 100);
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  const monthly = monthlyRate === 0 ? principal / n : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);

  return (
    <div className="bg-muted/40 rounded-2xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h4 className="font-serif font-semibold text-base">Mortgage Estimate</h4>
      </div>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-muted-foreground w-28 shrink-0">Down payment</label>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={down}
              onChange={e => setDown(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xs font-semibold w-8 text-right">{down}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-muted-foreground w-28 shrink-0">Interest rate</label>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min={10}
              max={25}
              step={0.5}
              value={rate}
              onChange={e => setRate(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xs font-semibold w-8 text-right">{rate}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <label className="text-xs text-muted-foreground w-28 shrink-0">Loan term</label>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={years}
              onChange={e => setYears(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xs font-semibold w-12 text-right">{years} yrs</span>
          </div>
        </div>
      </div>
      <div className="bg-primary text-primary-foreground rounded-xl p-4 text-center">
        <p className="text-xs opacity-80 mb-1">Estimated monthly payment</p>
        <p className="text-2xl font-serif font-semibold">{formatPrice(Math.round(monthly), "rent")}</p>
        <p className="text-xs opacity-70 mt-1">
          {formatPrice(Math.round(price * down / 100))} down · {years}-year term
        </p>
      </div>
      <p className="text-[10px] text-muted-foreground mt-2 text-center">
        Indicative estimate only. Contact a bank for a formal mortgage quote.
      </p>
    </div>
  );
}

export default function PropertyDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const { sessionId } = useSession();
  const queryClient = useQueryClient();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [galleryTab, setGalleryTab] = useState<"photos" | "video">("photos");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const { user } = useAuth();
  const isAgent = user?.role === "agent" || user?.role === "owner";

  const { data: property, isLoading } = useGetProperty(id, {
    query: { enabled: !!id, queryKey: getGetPropertyQueryKey(id) }
  });

  const { data: similarProperties } = useListSimilarProperties(id, {
    query: { enabled: !!id, queryKey: getListSimilarPropertiesQueryKey(id) }
  });

  const { data: favorites } = useListFavorites(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getListFavoritesQueryKey({ sessionId }) } }
  );

  const isFavorited = favorites?.some((f) => f.id === id) ?? false;
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggleFavorite = () => {
    if (!sessionId) return;
    const action = isFavorited ? removeFavorite : addFavorite;
    action.mutate(
      { data: { sessionId, propertyId: id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey({ sessionId }) });
          toast({
            title: isFavorited ? "Removed from favorites" : "Added to favorites",
            description: isFavorited ? "Property removed from your saved list." : "Property saved to your favorites.",
          });
        }
      }
    );
  };

  const createInquiry = useCreateInquiry();

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", email: "", phone: "", message: "" }
  });

  useEffect(() => {
    if (property) {
      if (!form.getValues("message")) {
        form.setValue("message", `I'm interested in the property at ${property.address}, ${property.city}. I'd like to schedule a tour or get more information.`);
      }
      setVideoUrl(property.videoUrl ?? null);
    }
  }, [property, form]);

  const onSubmit = (values: z.infer<typeof inquirySchema>) => {
    createInquiry.mutate(
      { data: { propertyId: id, ...values, phone: values.phone || null } },
      {
        onSuccess: () => {
          toast({ title: "Inquiry Sent", description: "An agent will get back to you shortly." });
          form.reset();
        },
      }
    );
  };

  const jsonLd = useMemo(() => {
    if (!property) return null;
    return {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: property.title,
      description: property.description ?? `${property.beds} bed, ${property.baths} bath property in ${property.city}, Nigeria.`,
      url: typeof window !== "undefined" ? window.location.href : "",
      image: property.images?.[0] ?? "",
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address,
        addressLocality: property.city,
        addressRegion: property.state,
        addressCountry: "NG",
      },
      numberOfRooms: property.beds,
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.sqft,
        unitCode: "FTK",
      },
      offers: {
        "@type": "Offer",
        price: property.price,
        priceCurrency: "NGN",
        availability: "https://schema.org/InStock",
      },
    };
  }, [property]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-[60vh] w-full rounded-2xl mb-4" />
        <div className="flex gap-4 mb-12">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-32 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div><Skeleton className="h-[400px] w-full rounded-xl" /></div>
        </div>
      </div>
    );
  }

  if (!property) return <div className="p-20 text-center text-xl font-serif">Property not found</div>;

  const allImages = [property.coverImage, ...(property.images || [])];
  const agentRating = Number((4.5 + (property.agent.id % 5) * 0.1).toFixed(1));
  const reviewCount = 18 + (property.agent.id * 7) % 40;
  const waPhone = property.agent.phone.replace(/\D/g, "");
  const waMsg = encodeURIComponent(`Hi ${property.agent.name}, I found your listing on Baytna — ${property.title} at ${property.address}, ${property.city}. I'd love to schedule a viewing.`);
  const pricePerSqft = property.sqft > 0 ? Math.round(property.price / property.sqft) : 0;
  const neighborhoodTags = CITY_TAGS[property.city] || [];
  const isShortlet = property.listingType === "shortlet";
  const lat = property.latitude ? Number(property.latitude) : null;
  const lng = property.longitude ? Number(property.longitude) : null;
  const hasMap = lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng);

  return (
    <div className="bg-background min-h-screen pb-20">
      <SeoHead
        title={property ? `${property.title} — ${property.city}` : "Property Details"}
        description={property ? `${LISTING_LABELS[property.listingType] ?? ""} · ${property.beds} bed · ${property.baths} bath · ${property.sqft?.toLocaleString()} sqft in ${property.address}, ${property.city}. Listed on Baytna.` : undefined}
        image={property?.images?.[0]}
        type="article"
      />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="container mx-auto px-4 py-6">
        <Link href="/browse" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to listings
        </Link>

        {/* Gallery */}
        <div className="mb-10">
          {/* Tab toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setGalleryTab("photos")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${galleryTab === "photos" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              <Images className="w-4 h-4" />
              Photos
              <span className="ml-1 text-xs opacity-70">({allImages.length})</span>
            </button>
            <button
              onClick={() => setGalleryTab("video")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${galleryTab === "video" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              <Video className="w-4 h-4" />
              Video Tour
              {videoUrl && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />}
            </button>
          </div>

          {galleryTab === "photos" ? (
            <>
              <div className="relative aspect-[16/9] md:aspect-[21/9] bg-muted rounded-2xl overflow-hidden mb-4 group">
                <img
                  src={allImages[activeImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-1000"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`backdrop-blur-sm border-none uppercase tracking-wider text-xs px-3 py-1 font-semibold ${isShortlet ? "bg-amber-500 text-white" : "bg-background/90 text-foreground"}`}>
                    {isShortlet && <Moon className="w-3 h-3 mr-1 inline" />}
                    {LISTING_LABELS[property.listingType] ?? property.listingType}
                  </Badge>
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm border-none uppercase tracking-wider text-xs px-3 py-1 font-semibold">
                    {property.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full">
                  {activeImageIndex + 1} / {allImages.length} photos
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full bg-background/50 backdrop-blur border-none hover:bg-background shadow-sm h-12 w-12"
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-6 w-6 ${isFavorited ? "fill-destructive text-destructive" : ""}`} />
                </Button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 w-32 h-24 md:w-40 md:h-28 rounded-xl overflow-hidden snap-start transition-all ${activeImageIndex === idx ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {videoUrl ? (
                <PropertyVideoPlayer videoUrl={videoUrl} title={property.title} />
              ) : (
                <div className="aspect-[16/9] md:aspect-[21/9] bg-muted rounded-2xl flex flex-col items-center justify-center gap-3">
                  <Video className="w-12 h-12 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">No video tour available yet.</p>
                </div>
              )}
              {isAgent && (
                <PropertyVideoUpload
                  propertyId={property.id}
                  existingVideoUrl={videoUrl}
                  onVideoChange={setVideoUrl}
                />
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
          {/* Main Content */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-2 leading-tight">
                {formatPrice(property.price, property.listingType as "sale" | "rent" | "shortlet")}
              </h1>
              <p className="text-lg text-muted-foreground font-light mb-2">{property.title}</p>
              {property.verified && (
                <div className="inline-flex items-center gap-1.5 bg-[#2E7D32] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified Listing
                </div>
              )}
              <div className="flex items-center text-muted-foreground gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>

              <div className="flex flex-wrap items-center gap-5 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-full"><BedDouble className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-lg">{property.beds}</p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-full"><Bath className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-lg">{property.baths}</p>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-full"><Square className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-lg">{formatSqft(property.sqft)}</p>
                    <p className="text-xs text-muted-foreground">Sqft</p>
                  </div>
                </div>
                {!isShortlet && pricePerSqft > 0 && (
                  <>
                    <div className="w-px h-10 bg-border hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-full">
                        <span className="text-sm font-bold">₦</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          {pricePerSqft >= 1_000_000
                            ? `₦${(pricePerSqft / 1_000_000).toFixed(1)}M`
                            : pricePerSqft >= 1_000
                            ? `₦${Math.round(pricePerSqft / 1_000)}K`
                            : `₦${pricePerSqft.toLocaleString()}`}
                        </p>
                        <p className="text-xs text-muted-foreground">Per sqft</p>
                      </div>
                    </div>
                  </>
                )}
                {property.yearBuilt && (
                  <>
                    <div className="w-px h-10 bg-border hidden sm:block"></div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-full"><Calendar className="w-5 h-5" /></div>
                      <div>
                        <p className="font-semibold text-lg">{property.yearBuilt}</p>
                        <p className="text-xs text-muted-foreground">Year Built</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-serif font-semibold mb-4">About this home</h2>
              <div className="prose prose-lg text-muted-foreground max-w-none">
                <p className="whitespace-pre-line leading-relaxed">{property.description}</p>
              </div>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-serif font-semibold mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Neighbourhood Highlights */}
            {neighborhoodTags.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-serif font-semibold mb-4">Neighbourhood</h2>
                <p className="text-muted-foreground mb-4">Key things to know about {property.city}:</p>
                <div className="flex flex-wrap gap-2">
                  {neighborhoodTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-sm font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {hasMap && (
              <div className="mb-10">
                <h2 className="text-2xl font-serif font-semibold mb-4">Location</h2>
                <Suspense fallback={<Skeleton className="h-80 w-full rounded-2xl" />}>
                  <PropertyMap
                    latitude={lat!}
                    longitude={lng!}
                    title={property.title}
                    address={`${property.address}, ${property.city}`}
                  />
                </Suspense>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-24 space-y-4">
              <div className="bg-card border shadow-xl shadow-black/5 rounded-3xl p-6 md:p-8">
                {/* Agent */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b">
                  <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
                    <AvatarImage src={property.agent.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-serif font-semibold text-lg">
                      {property.agent.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-primary mb-0.5 uppercase tracking-wider">Listing Agent</p>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif text-lg font-semibold truncate">{property.agent.name}</h3>
                      <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{property.agent.agency}</p>
                    <StarRating rating={agentRating} />
                    <p className="text-xs text-muted-foreground">{reviewCount} reviews</p>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${waPhone}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold text-sm transition-colors mb-3"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Agent
                </a>

                {/* Book Inspection */}
                <div className="mb-4">
                  <BookInspectionDialog
                    propertyId={property.id}
                    propertyTitle={property.title}
                  />
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">or send a message</span>
                  <Separator className="flex-1" />
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Name" className="bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
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
                          <FormControl>
                            <Input type="email" placeholder="Email Address" className="bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
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
                          <FormControl>
                            <Input type="tel" placeholder="+234 — Phone (optional)" className="bg-muted/50 border-transparent focus-visible:bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="I'm interested in this property..."
                              className="min-h-[100px] bg-muted/50 border-transparent focus-visible:bg-background resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-11 text-base rounded-xl" disabled={createInquiry.isPending}>
                      {createInquiry.isPending ? "Sending..." : "Send Message"}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      By sending this message you agree to our Terms of Use and Privacy Policy.
                    </p>
                  </form>
                </Form>
              </div>

              {/* Mortgage Calculator — only for sale */}
              {property.listingType === "sale" && (
                <MortgageCalculator price={property.price} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties && similarProperties.length > 0 && (
        <div className="bg-muted/30 py-20 mt-12 border-t">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-semibold mb-8">Similar Homes in {property.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.slice(0, 4).map(similar => (
                <PropertyCard key={similar.id} property={similar} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
