import { useParams, Link } from "wouter";
import { ArrowLeft, MapPin } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useListProperties, useListCities } from "@/lib/api-client";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function CityLanding() {
  const params = useParams();
  const decodedCity = decodeURIComponent(params.city || "");

  const { data: cities, isLoading: isCitiesLoading } = useListCities();
  const { data: properties, isLoading: isPropertiesLoading } = useListProperties({ city: decodedCity });

  const cityData = cities?.find(c => c.city.toLowerCase() === decodedCity.toLowerCase());

  if (isCitiesLoading) {
    return <div className="h-[60vh] bg-muted animate-pulse" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`Homes in ${decodedCity}`}
        description={`Browse ${cityData?.count ?? ""} exceptional homes for sale, rent, and short let in ${decodedCity}, Nigeria. Explore curated listings on Baytna.`}
        image={cityData?.coverImage}
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={cityData?.coverImage || "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=2000&q=80"} 
          alt={decodedCity} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 container mx-auto px-4">
          <Link href="/browse" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Cities
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-white/90 mb-4">
              <MapPin className="w-5 h-5" />
              <span className="uppercase tracking-widest font-semibold text-sm">Location</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-white mb-6 drop-shadow-md">
              {decodedCity}
            </h1>
            <p className="text-xl text-white/90 drop-shadow max-w-xl">
              {cityData ? `${cityData.count} exceptional homes available in ${decodedCity}.` : `Discover homes in ${decodedCity}.`}
            </p>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12 border-b pb-6">
          <h2 className="text-3xl font-serif font-semibold">Available Properties</h2>
          <p className="text-muted-foreground">{properties?.length || 0} results</p>
        </div>

        {isPropertiesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-6">No properties currently listed in {decodedCity}.</p>
            <Link href="/browse" className="text-primary font-medium hover:underline">
              Browse all locations
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
