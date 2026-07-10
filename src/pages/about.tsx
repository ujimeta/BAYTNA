import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/SeoHead";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="About Baytna"
        description="Baytna is Nigeria's premier real estate marketplace — connecting buyers, renters, and short-let guests with exceptional homes curated by the best agents in the country."
      />
      {/* Hero */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 tracking-tight text-balance">
              Real estate for those who care about design.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed text-balance">
              Baytna is an editorial marketplace connecting discerning buyers with spaces that inspire. We believe a home is more than a transaction—it's the foundation of a well-lived life.
            </p>
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1616486028091-628d0959f6d4?auto=format&fit=crop&w=1000&q=80" 
                alt="Beautiful living room" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-serif font-semibold mb-4 text-primary">The Baytna Philosophy</h2>
                <div className="w-12 h-1 bg-accent mb-6"></div>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Most real estate platforms treat homes like commodities on a spreadsheet. They focus purely on specs: square footage, bed counts, and algorithms.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                We built Baytna because we were frustrated by the lack of aesthetic consideration in the home-buying process. We wanted a place that felt like flipping through our favorite architecture magazine, where the photography breathed and the typography was treated with respect.
              </p>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Our curated collection of properties is presented without the clutter, noise, and anxiety typical of the industry. Because finding your next space should feel calm, considered, and inspiring.
              </p>
              
              <div className="pt-8">
                <Button size="lg" asChild className="rounded-full px-8">
                  <Link href="/browse">Explore our collection <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl font-serif font-semibold text-center mb-16">Our Core Values</h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-medium">01</div>
            <h3 className="text-xl font-serif font-semibold">Editorial Quality</h3>
            <p className="text-muted-foreground leading-relaxed">Every listing is presented with large, uncropped photography and clean typography. No harsh watermarks, no distorted images.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-medium">02</div>
            <h3 className="text-xl font-serif font-semibold">Calm Discovery</h3>
            <p className="text-muted-foreground leading-relaxed">We remove the urgency tactics. Take your time scrolling. Save what inspires you. The right home shouldn't be rushed.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-serif font-medium">03</div>
            <h3 className="text-xl font-serif font-semibold">Curated Experts</h3>
            <p className="text-muted-foreground leading-relaxed">Our agents understand that aesthetics matter. They are local experts who appreciate architecture, history, and interior design.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
