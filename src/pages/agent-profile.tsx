import { useParams, Link } from "wouter";
import { ArrowLeft, Mail, Phone, Building } from "lucide-react";
import { useGetAgent, useListProperties, getGetAgentQueryKey } from "@/lib/api-client";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AgentProfile() {
  const params = useParams();
  const id = Number(params.id);

  const { data: agent, isLoading: isAgentLoading } = useGetAgent(id, { query: { enabled: !!id, queryKey: getGetAgentQueryKey(id) } });
  // Fetch properties by this agent - the API doesn't have an agentId filter exposed in params,
  // but let's assume we can filter client-side for now or just fetch all and filter since it's a mockup
  const { data: allProperties, isLoading: isPropsLoading } = useListProperties();
  
  const agentProperties = allProperties?.filter(p => p.agentId === id) || [];

  if (isAgentLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="w-32 h-8 mb-12" />
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <Skeleton className="w-64 h-64 rounded-full" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!agent) return <div className="p-20 text-center font-serif text-xl">Agent not found</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Profile */}
      <div className="bg-muted/30 pt-12 pb-20 border-b">
        <div className="container mx-auto px-4">
          <Link href="/agents" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Agents
          </Link>
          
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
            <div className="shrink-0 relative">
              {agent.avatarUrl ? (
                <img
                  src={agent.avatarUrl}
                  alt={agent.name}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-8 border-background shadow-xl"
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-background shadow-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-5xl md:text-7xl font-serif font-semibold text-primary">
                    {agent.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-lg">
                Baytna Agent
              </div>
            </div>
            
            <div className="flex-1 pt-4">
              <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-2">{agent.name}</h1>
              <p className="text-xl text-primary font-medium mb-6">{agent.title}</p>
              
              <div className="flex flex-wrap gap-6 mb-8 text-sm">
                <div className="flex items-center gap-2 text-foreground">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{agent.agency}</span>
                </div>
                {agent.email && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a href={`mailto:${agent.email}`} className="font-medium hover:text-primary transition-colors">{agent.email}</a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{agent.phone}</span>
                </div>
              </div>
              
              <div className="prose prose-lg text-muted-foreground max-w-3xl">
                <p>{agent.bio}</p>
              </div>

              <div className="mt-8 flex gap-4">
                <Button className="rounded-full px-8 h-12 text-base">Contact {agent.name.split(' ')[0]}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent's Listings */}
      <div className="container mx-auto px-4 mt-20">
        <h2 className="text-3xl font-serif font-semibold mb-2">Represented Properties</h2>
        <p className="text-muted-foreground mb-10">Exclusive listings represented by {agent.name}</p>

        {isPropsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-xl w-full" />)}
          </div>
        ) : agentProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agentProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-muted/20 border border-dashed rounded-2xl p-16 text-center">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-serif font-medium mb-2">No active listings</h3>
            <p className="text-muted-foreground max-w-md mx-auto">This agent currently has no active properties listed on the market.</p>
          </div>
        )}
      </div>
    </div>
  );
}
