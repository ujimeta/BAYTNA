import { useState } from "react";
import { useLocation, Link } from "wouter";
import { SeoHead } from "@/components/SeoHead";
import { Search, TrendingUp, ArrowRight, Home as HomeIcon, Building2, KeyRound, Star, Landmark } from "lucide-react";
import { useListingUpdates } from "@/hooks/use-listing-updates";
import { ListingUpdateBanner } from "@/components/listing-update-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/property/PropertyCard";
import { formatPrice } from "@/lib/format";
import { 
  useListFeaturedProperties, 
  useListCities, 
  useGetMarketStats, 
  useGetHomeStats,
  useListAgents 
} from "@/lib/api-client";

const QUICK_FILTERS = [
  { label: "Buy", icon: HomeIcon, href: "/browse?listingType=sale" },
  { label: "Rent", icon: KeyRound, href: "/browse?listingType=rent" },
  { label: "Houses", icon: HomeIcon, href: "/browse?propertyType=house" },
  { label: "Apartments", icon: Building2, href: "/browse?propertyType=condo" },
  { label: "Land", icon: Landmark, href: "/browse?propertyType=land" },
];

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

export default function Home() {
  console.log("HOME RENDER");
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { pending, refresh, dismiss } = useListingUpdates();

  const { data: featuredProperties, isLoading: isFeaturedLoading } = useListFeaturedProperties();
  const { data: cities, isLoading: isCitiesLoading } = useListCities();
  const { data: marketStats, isLoading: isStatsLoading } = useGetMarketStats();
  const { data: homeStats } = useGetHomeStats();
  const { data: agents, isLoading: isAgentsLoading } = useListAgents();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/browse?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setLocation('/browse');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead />
      {pending && (
        <ListingUpdateBanner
          update={pending}
          onRefresh={refresh}
          onDismiss={dismiss}
        />
      )}
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[620px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Beautiful home interior" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white/90 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Your Global Home Marketplace
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-white mb-5 text-balance drop-shadow-lg tracking-tight">
            Find Your Home. Trust the Process.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light drop-shadow">
            Discover verified properties for sale, rent, and short let across Nigeria — with agents you can trust.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group mb-5">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search by city, neighbourhood, or property type..."
              className="w-full h-16 pl-12 pr-32 text-lg rounded-full bg-background/95 backdrop-blur shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 rounded-full px-6 h-auto"
            >
              Search
            </Button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {QUICK_FILTERS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white text-sm font-medium transition-all hover:scale-105"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-5 flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{homeStats ? `${homeStats.listingCount}+` : "—"}</span> Active Listings
          </div>
          <div className="hidden md:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{homeStats ? homeStats.agentCount : "—"}</span> Verified Agents
          </div>
          <div className="hidden md:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{homeStats ? homeStats.cityCount : "—"}</span> Cities Covered
          </div>
          <div className="hidden md:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <StarRating rating={4.9} />
            <span>Rated by buyers & renters</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2 text-primary font-medium">
            WhatsApp agents directly
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 md:py-28 px-4 container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground font-semibold mb-4 tracking-tight">Featured Homes</h2>
            <p className="text-muted-foreground text-lg max-w-xl">Curated properties selected for their exceptional design, architecture, and character.</p>
          </div>
          <Button variant="outline" asChild className="shrink-0 rounded-full h-12 px-6">
            <Link href="/browse?featured=true">View all featured <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[4/3] mb-4"></div>
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties?.slice(0, 6).map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* Explore by City */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground font-semibold mb-4 tracking-tight">Explore by City</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Discover beautiful homes in vibrant neighbourhoods across Nigeria.</p>
          </div>

          {isCitiesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-muted rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities?.map(city => (
                <Link key={city.city} href={`/city/${city.city}`} className="group relative h-80 rounded-xl overflow-hidden block">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10" />
                  <img 
                    src={city.coverImage || "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80"} 
                    alt={city.city} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-2xl font-serif font-medium text-white mb-1">{city.city}</h3>
                    <p className="text-white/80 text-sm">{city.count} listings available</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
            <TrendingUp className="w-96 h-96" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-3 max-w-2xl text-balance">
              The real estate market is constantly moving.
            </h2>
            <p className="text-primary-foreground/70 mb-12 text-lg">We keep you ahead of the curve.</p>
            
            {isStatsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-10 bg-primary-foreground/20 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-primary-foreground/20 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : marketStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div>
                  <p className="text-4xl md:text-5xl font-serif mb-2">{marketStats.totalListings.toLocaleString()}+</p>
                  <p className="text-primary-foreground/70 font-medium tracking-wide uppercase text-sm">Active Listings</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-serif mb-2">
                    {formatPrice(marketStats.avgSalePrice)}
                  </p>
                  <p className="text-primary-foreground/70 font-medium tracking-wide uppercase text-sm">Avg Sale Price</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-serif mb-2">{marketStats.cityCount}</p>
                  <p className="text-primary-foreground/70 font-medium tracking-wide uppercase text-sm">Active Cities</p>
                </div>
                <div>
                  <p className="text-4xl md:text-5xl font-serif mb-2">{marketStats.agentCount}</p>
                  <p className="text-primary-foreground/70 font-medium tracking-wide uppercase text-sm">Expert Agents</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Trending Agents */}
      <section className="py-20 px-4 container mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground font-semibold mb-4 tracking-tight">Top Agents</h2>
            <p className="text-muted-foreground text-lg max-w-xl">Verified professionals who know every neighbourhood, price trend, and opportunity.</p>
          </div>
          <Button variant="ghost" asChild className="shrink-0 h-12">
            <Link href="/agents">Meet all agents <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        {isAgentsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-muted rounded-xl h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents?.slice(0, 4).map(agent => {
              const rating = Number((4.5 + (agent.id % 5) * 0.1).toFixed(1));
              const waPhone = agent.phone.replace(/\D/g, "");
              return (
                <div key={agent.id} className="group block text-center">
                  <Link href={`/agents/${agent.id}`}>
                    <div className="relative mb-4 mx-auto w-36 h-36 rounded-full overflow-hidden border-4 border-transparent group-hover:border-primary/20 transition-all">
                      <img 
                        src={agent.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${agent.name}`} 
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-serif font-medium text-foreground mb-0.5 group-hover:text-primary transition-colors">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{agent.agency}</p>
                    <div className="flex justify-center mb-3">
                      <StarRating rating={rating} />
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-xs font-medium mb-3">
                      {agent.listingsCount} active listings
                    </div>
                  </Link>
                  <div className="flex justify-center">
                    <a
                      href={`https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(agent.name)}%2C%20I%20found%20your%20profile%20on%20Baytna%20and%20I%27d%20like%20to%20enquire%20about%20a%20property.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
