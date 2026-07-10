import { Link } from "wouter";
import { Heart, Search } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { useListFavorites, getListFavoritesQueryKey } from "@/lib/api-client";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favorites() {
  const { sessionId } = useSession();

  const { data: favorites, isLoading } = useListFavorites(
    { sessionId },
    { query: { enabled: !!sessionId, queryKey: getListFavoritesQueryKey({ sessionId }) } }
  );

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-10 border-b pb-6">
          <Heart className="w-8 h-8 text-primary fill-primary/20" />
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">Saved Homes</h1>
            <p className="text-muted-foreground mt-1">{favorites?.length || 0} properties saved in this session</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-32 max-w-lg mx-auto">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-8">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-serif font-semibold mb-3">No saved homes yet</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              When you see a home you love, tap the heart icon to save it here. Build a collection of spaces that inspire you.
            </p>
            <Button size="lg" asChild className="rounded-full px-8">
              <Link href="/browse">
                <Search className="w-4 h-4 mr-2" /> Start Exploring
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
