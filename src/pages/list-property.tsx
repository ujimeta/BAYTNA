import { Building2, CheckCircle2, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SeoHead } from "@/components/SeoHead";

const STEPS = [
  {
    number: "01",
    title: "Create your account",
    description: "Sign up and verify your identity as an agent or property owner. Takes less than 5 minutes.",
  },
  {
    number: "02",
    title: "Submit your listing",
    description: "Add property details, photos, and price. Our team reviews every submission for quality and accuracy.",
  },
  {
    number: "03",
    title: "Get verified",
    description: "We confirm your listing is genuine before it goes live. Verified listings get 3× more enquiries.",
  },
  {
    number: "04",
    title: "Connect with buyers",
    description: "Receive direct WhatsApp enquiries from serious buyers and renters across Nigeria.",
  },
];

const BENEFITS = [
  "Verified badge on every approved listing",
  "Direct WhatsApp connections — no middlemen",
  "Featured placement for premium listings",
  "Professional photography tips & support",
  "Analytics — see who views your listing",
  "Access to Nigeria's growing diaspora buyer market",
];

export default function ListProperty() {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="List Your Property"
        description="List your property on Baytna — Nigeria's trusted property marketplace. Reach verified buyers and renters across Nigeria and the diaspora."
      />

      {/* Hero */}
      <section className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              For Agents &amp; Property Owners
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-6 tracking-tight text-foreground">
              List your property on Baytna.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Reach thousands of verified buyers, renters, and diaspora investors actively looking for properties across Nigeria. Every listing is reviewed, verified, and presented with care.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/submit-listing">
                <Button size="lg" className="rounded-full px-8 gap-2 w-full sm:w-auto">
                  <Building2 className="w-5 h-5" />
                  Submit a Listing Now
                </Button>
              </a>
              <a
                href="https://wa.me/2348000000000?text=Hi%2C%20I%27d%20like%20to%20list%20my%20property%20on%20Baytna."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="rounded-full px-8 gap-2 w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-foreground">How it works</h2>
          <div className="w-12 h-1 bg-primary mb-12 rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="space-y-4">
                <span className="text-4xl font-serif font-bold text-primary/20">{step.number}</span>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 border-y py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 text-foreground">
                Why list with Baytna?
              </h2>
              <div className="w-12 h-1 bg-primary mb-8 rounded-full" />
              <ul className="space-y-4">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-serif font-semibold text-foreground">Get in touch</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our team is available Monday–Saturday, 8am–6pm WAT. Reach us through any of the channels below and we'll get your listing live within 24 hours.
              </p>
              <div className="space-y-4">
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">WhatsApp</p>
                    <p className="text-xs text-muted-foreground">+234 800 000 0000</p>
                  </div>
                </a>
                <a
                  href="mailto:listings@baytna.ng"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">listings@baytna.ng</p>
                  </div>
                </a>
                <a
                  href="tel:+2348000000000"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Phone</p>
                    <p className="text-xs text-muted-foreground">+234 800 000 0000</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
