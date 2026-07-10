import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Property } from "@/lib/api-client";
import { formatPrice, formatSqft } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useAddFavorite, useRemoveFavorite, useListFavorites, getListFavoritesQueryKey } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface PropertyCardProps {
  property: Property;
}

function pricePerSqft(price: number, sqft: number): string {
  if (!sqft) return "";
  const val = Math.round(price / sqft);
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M/sqft`;
  if (val >= 1_000) return `₦${Math.round(val / 1_000)}K/sqft`;
  return `₦${val.toLocaleString("en-NG")}/sqft`;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { sessionId } = useSession();
  const queryClient = useQueryClient();
  
  const { data: favorites } = useListFavorites(
    { sessionId }, 
    { query: { enabled: !!sessionId, queryKey: getListFavoritesQueryKey({ sessionId }) } }
  );

  const isFavorited = favorites?.some((f) => f.id === property.id) ?? false;

  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sessionId) return;

    const action = isFavorited ? removeFavorite : addFavorite;
    action.mutate(
      { data: { sessionId, propertyId: property.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListFavoritesQueryKey({ sessionId }) });
        }
      }
    );
  };

  return (
    <Link href={`/property/${property.id}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img 
          src={property.coverImage} 
          alt={property.title}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground hover:bg-background/90 uppercase tracking-wider text-[10px] font-semibold border-none">
            {property.listingType === "sale" ? "For Sale" : property.listingType === "shortlet" ? "Short Let" : "For Rent"}
          </Badge>
          {property.featured && (
            <Badge className="bg-primary/90 backdrop-blur-sm hover:bg-primary/90 uppercase tracking-wider text-[10px] font-semibold border-none">
              Featured
            </Badge>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/50 transition-colors h-8 w-8"
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-destructive text-destructive" : "text-white"}`} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>

        {/* Price per sqft overlay */}
        {property.sqft > 0 && (
          <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-medium px-2 py-1 rounded-full">
            {pricePerSqft(property.price, property.sqft)}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-baseline gap-2">
          <h3 className="font-serif text-xl font-semibold text-foreground">
            {formatPrice(property.price, property.listingType)}
          </h3>
        </div>
        
        <p className="text-sm font-medium text-foreground/80 truncate">{property.title}</p>
        
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          <span>{property.beds} bd</span>
          <span>&middot;</span>
          <span>{property.baths} ba</span>
          <span>&middot;</span>
          <span>{formatSqft(property.sqft)} sqft</span>
        </div>
        
        <p className="text-sm text-muted-foreground truncate">
          {property.address}, {property.city}, {property.state}
        </p>
      </div>
    </Link>
  );
}
