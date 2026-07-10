import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-serif text-2xl font-semibold text-primary">
              Baytna.
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm text-balance leading-relaxed">
              Nigeria's trusted property marketplace — verified listings, verified agents, and intelligent tools to help you find, rent, buy, and invest with confidence.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-4">Discover</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/browse?listingType=sale" className="hover:text-primary transition-colors">For Sale</Link></li>
              <li><Link href="/browse?listingType=rent" className="hover:text-primary transition-colors">For Rent</Link></li>
              <li><Link href="/list-property" className="hover:text-primary transition-colors">List Your Property</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-4">Cities</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/city/Lagos" className="hover:text-primary transition-colors">Lagos</Link></li>
              <li><Link href="/city/Abuja" className="hover:text-primary transition-colors">Abuja</Link></li>
              <li><Link href="/city/Kano" className="hover:text-primary transition-colors">Kano</Link></li>
              <li><Link href="/city/Port Harcourt" className="hover:text-primary transition-colors">Port Harcourt</Link></li>
              <li><Link href="/city/Kaduna" className="hover:text-primary transition-colors">Kaduna</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Baytna Technologies Ltd. All rights reserved. Nigeria's Trusted Property Marketplace.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
