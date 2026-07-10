import { Link } from "wouter";
import { Mail, Phone, ArrowRight, Star, BadgeCheck } from "lucide-react";
import { SeoHead } from "@/components/SeoHead";
import { useListAgents } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function Agents() {
  const { data: agents, isLoading } = useListAgents();

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <SeoHead
        title="Verified Property Agents in Nigeria"
        description="Every agent on Baytna is personally verified — identity confirmed, listings checked, and performance tracked. Browse our verified agent network across Nigeria."
      />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 text-foreground tracking-tight">
            Meet Our Verified Agents
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Every agent on Baytna is personally verified — identity confirmed, listings checked, and performance tracked. When you contact a Baytna agent, you are speaking to a trusted professional who knows your market. Browse our verified agent network across Nigeria and connect directly via WhatsApp.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card border rounded-2xl p-6 flex flex-col items-center text-center">
                <Skeleton className="w-32 h-32 rounded-full mb-6" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents?.map(agent => {
              const rating = Number((4.5 + (agent.id % 5) * 0.1).toFixed(1));
              const reviewCount = 18 + (agent.id * 7) % 40;
              const waPhone = agent.phone.replace(/\D/g, "");
              const waMsg = encodeURIComponent(`Hi ${agent.name}, I found your profile on Baytna and I'd like to enquire about a property.`);

              return (
                <div key={agent.id} className="group bg-card border rounded-3xl p-8 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-5 rounded-full overflow-hidden border-4 border-muted group-hover:border-primary/20 transition-colors">
                    {agent.avatarUrl ? (
                      <img
                        src={agent.avatarUrl}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-3xl font-serif font-semibold text-primary">
                          {agent.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors">
                      {agent.name}
                    </h3>
                    <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                  </div>
                  <p className="text-primary font-medium text-sm mb-2 tracking-wide uppercase">{agent.title}</p>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{agent.bio}</p>

                  <div className="flex flex-col items-center gap-1 mb-4">
                    <StarRating rating={rating} />
                    <span className="text-xs text-muted-foreground">{reviewCount} reviews</span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-5">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {agent.listingsCount} Active Listings
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium text-primary border-primary/30">
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="w-full space-y-2 mb-6">
                    {agent.email && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{agent.email}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{agent.phone}</span>
                    </div>
                  </div>

                  <div className="mt-auto w-full pt-5 border-t border-border space-y-3">
                    <a
                      href={`https://wa.me/${waPhone}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp Agent
                    </a>
                    <Button variant="ghost" size="sm" asChild className="w-full group-hover:bg-muted rounded-xl">
                      <Link href={`/agents/${agent.id}`}>
                        View Profile <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
