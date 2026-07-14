import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import FiltersContent from "@/components/browse/FiltersContent";
import { SeoHead } from "@/components/SeoHead";
import { Filter, SlidersHorizontal, Search, Bell } from "lucide-react";
import { useListProperties, ListPropertiesPropertyType, ListPropertiesListingType, ListPropertiesSort } from "@/lib/api-client";
import { useListingUpdates } from "@/hooks/use-listing-updates";
import { ListingUpdateBanner } from "@/components/listing-update-banner";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const QUICK_PILLS = [
  { label: "For Sale", field: "listingType", value: "sale" },
  { label: "For Rent", field: "listingType", value: "rent" },
  { label: "Short Let", field: "listingType", value: "shortlet" },
  { label: "Lagos", field: "city", value: "Lagos" },
  { label: "Abuja", field: "city", value: "Abuja" },
  { label: "Kano", field: "city", value: "Kano" },
  { label: "4+ Beds", field: "minBeds", value: "4" },
];

export default function Browse() {
  const [location] = useLocation();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [alertSaved, setAlertSaved] = useState(false);
  
  const searchParams = new URLSearchParams(window.location.search);
  const qParam = searchParams.get("q") || "";
  const cityParam = searchParams.get("city") || "";
  const propertyTypeParam = searchParams.get("propertyType") as ListPropertiesPropertyType | "";
  const listingTypeParam = searchParams.get("listingType") as ListPropertiesListingType | "";
  const minPriceParam = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPriceParam = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const bedsParam = searchParams.get("minBeds") ? Number(searchParams.get("minBeds")) : undefined;
  const sortParam = searchParams.get("sort") as ListPropertiesSort | "newest";

  const [q, setQ] = useState(qParam);
  const [city, setCity] = useState(cityParam);
  const [propertyType, setPropertyType] = useState<string>(propertyTypeParam);
  const [listingType, setListingType] = useState<string>(listingTypeParam);
  const [minPrice, setMinPrice] = useState<number | undefined>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(maxPriceParam);
  const [minBeds, setMinBeds] = useState<number | undefined>(bedsParam);
  const [sort, setSort] = useState<string>(sortParam);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params.get("q") || "");
    setCity(params.get("city") || "");
    setPropertyType(params.get("propertyType") || "");
    setListingType(params.get("listingType") || "");
    setMinPrice(params.get("minPrice") ? Number(params.get("minPrice")) : undefined);
    setMaxPrice(params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined);
    setMinBeds(params.get("minBeds") ? Number(params.get("minBeds")) : undefined);
    setSort(params.get("sort") || "newest");
  }, [location]);

  const { data: properties, isLoading } = useListProperties({
    q: qParam || undefined,
    city: cityParam || undefined,
    propertyType: propertyTypeParam || undefined,
    listingType: listingTypeParam || undefined,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    minBeds: bedsParam,
    sort: sortParam as ListPropertiesSort
  });

  const { pending, refresh, dismiss } = useListingUpdates();

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (propertyType && propertyType !== "all") params.set("propertyType", propertyType);
    if (listingType && listingType !== "all") params.set("listingType", listingType);
    if (minPrice) params.set("minPrice", minPrice.toString());
    if (maxPrice) params.set("maxPrice", maxPrice.toString());
    if (minBeds) params.set("minBeds", minBeds.toString());
    if (sort && sort !== "newest") params.set("sort", sort);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.dispatchEvent(new Event('popstate'));
    setAlertDismissed(false);
    setAlertSaved(false);
  };

  const clearFilters = () => {
    setQ(""); setCity(""); setPropertyType(""); setListingType("");
    setMinPrice(undefined); setMaxPrice(undefined); setMinBeds(undefined); setSort("newest");
    window.history.pushState({}, '', window.location.pathname);
    window.dispatchEvent(new Event('popstate'));
  };

  const applyPill = (field: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(field) === value) {
      params.delete(field);
    } else {
      params.set(field, value);
    }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const isPillActive = (field: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(field) === value;
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    const params = new URLSearchParams(window.location.search);
    if (val === "newest") { params.delete("sort"); } else { params.set("sort", val); }
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const hasActiveFilters = !!(qParam || cityParam || propertyTypeParam || listingTypeParam || minPriceParam || maxPriceParam || bedsParam);

  return (
    <div className="container mx-auto px-4 py-8">
      <SeoHead
        title="Browse Homes"
        description="Search thousands of homes for sale, rent, and short let across Nigeria. Filter by city, price, bedrooms, and property type on Baytna."
      />
      {pending && (
        <ListingUpdateBanner update={pending} onRefresh={refresh} onDismiss={dismiss} />
      )}

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {QUICK_PILLS.map((pill) => (
          <button
            key={`${pill.field}-${pill.value}`}
            onClick={() => applyPill(pill.field, pill.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              isPillActive(pill.field, pill.value)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Save Search Alert Bar */}
      {!alertDismissed && !isLoading && properties && properties.length > 0 && (
        <div className="mb-6 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Bell className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Get alerts for new listings</p>
            <p className="text-xs text-muted-foreground">Be the first to know when a matching property is listed.</p>
          </div>
          {alertSaved ? (
            <span className="text-sm text-primary font-medium shrink-0">Saved!</span>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                placeholder="Your email"
                type="email"
                value={alertEmail}
                onChange={e => setAlertEmail(e.target.value)}
                className="h-9 text-sm w-full sm:w-44"
              />
              <Button
                size="sm"
                className="shrink-0 h-9"
                onClick={() => { if (alertEmail) setAlertSaved(true); }}
              >
                Notify me
              </Button>
            </div>
          )}
          <button onClick={() => setAlertDismissed(true)} className="text-muted-foreground hover:text-foreground text-lg leading-none shrink-0 self-start sm:self-auto">×</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pr-4">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-serif font-semibold">Filters</h2>
          </div>
          <FiltersContent
  q={q}
  city={city}
  propertyType={propertyType}
  listingType={listingType}
  minPrice={minPrice}
  maxPrice={maxPrice}
  minBeds={minBeds}
  setQ={setQ}
  setCity={setCity}
  setPropertyType={setPropertyType}
  setListingType={setListingType}
  setMinPrice={setMinPrice}
  setMaxPrice={setMaxPrice}
  setMinBeds={setMinBeds}
  applyFilters={applyFilters}
  clearFilters={clearFilters}
/>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="sticky top-16 z-20 bg-background pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-semibold mb-1">Browse Homes</h1>
              <p className="text-muted-foreground text-sm">
                {isLoading ? "Loading properties..." : `Found ${properties?.length || 0} result${properties?.length !== 1 ? "s" : ""}`}
                {hasActiveFilters && !isLoading && (
                  <button onClick={clearFilters} className="ml-2 text-primary hover:underline text-xs">Clear filters</button>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden flex-1 sm:flex-none">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="font-serif text-2xl">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="h-[calc(100vh-8rem)] overflow-y-auto">
  <FiltersContent
    q={q}
    city={city}
    propertyType={propertyType}
    listingType={listingType}
    minPrice={minPrice}
    maxPrice={maxPrice}
    minBeds={minBeds}
    setQ={setQ}
    setCity={setCity}
    setPropertyType={setPropertyType}
    setListingType={setListingType}
    setMinPrice={setMinPrice}
    setMaxPrice={setMaxPrice}
    setMinBeds={setMinBeds}
    applyFilters={applyFilters}
    clearFilters={clearFilters}
  />
</div>
                </SheetContent>
              </Sheet>

              <Select value={sort || "newest"} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="beds_desc">Most Bedrooms</SelectItem>
                  <SelectItem value="sqft_desc">Largest Sqft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-sm mb-6">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-serif font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn't find any properties matching your current filters. Try adjusting your search criteria.
              </p>
              <Button onClick={clearFilters} variant="outline" className="rounded-full px-8">
                Clear all filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
