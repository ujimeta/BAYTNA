import { Link } from "wouter";
import { Menu, Heart, LogIn, LogOut, User, ChevronDown, Home, Users, Shield, MapPin, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

type Role = "buyer" | "agent" | "landlord" | "land_owner";

const ROLES: { value: Role; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: "buyer",
    label: "Buyer / Renter",
    description: "I'm looking for a home to buy or rent",
    icon: <User className="w-4 h-4" />,
  },
  {
    value: "agent",
    label: "Real Estate Agent",
    description: "I'm a professional listing agent",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: "landlord",
    label: "Landlord",
    description: "I own property I want to rent out",
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    value: "land_owner",
    label: "Land Owner",
    description: "I own land or plots for sale",
    icon: <MapPin className="w-4 h-4" />,
  },
];

const ROLE_BADGE: Record<Role, { label: string; icon: React.ReactNode }> = {
  buyer:      { label: "Buyer / Renter",      icon: <User className="w-3 h-3" /> },
  agent:      { label: "Agent",               icon: <Users className="w-3 h-3" /> },
  landlord:   { label: "Landlord",            icon: <Building2 className="w-3 h-3" /> },
  land_owner: { label: "Land Owner",          icon: <MapPin className="w-3 h-3" /> },
};

export function Navbar() {
  const { user, isLoading, isAuthenticated, login, logout, setRole } = useAuth();

  const currentRole = user?.role as Role | null | undefined;
  const badge = currentRole ? ROLE_BADGE[currentRole] : null;
  const isLister = currentRole === "agent" || currentRole === "landlord" || currentRole === "land_owner";

  const navLinks = [
    { href: "/browse", label: "Browse" },
    { href: "/agents", label: "Agents" },
    { href: "/about", label: "About" },
    { href: isLister ? "/submit-listing" : "/list-property", label: "List Property" },
  ];

  const initials = user
    ? ((user.firstName?.charAt(0) ?? "") + (user.lastName?.charAt(0) ?? "")).toUpperCase() || "U"
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl tracking-tighter font-semibold text-primary">Baytna.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Button>
          </Link>

          {/* Auth */}
          {!isLoading && (
            isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.profileImageUrl ?? undefined} />
                      <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {user.firstName || user.email || "Account"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  {/* Profile header */}
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.profileImageUrl ?? undefined} />
                        <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {badge && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                            {badge.icon} {badge.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Role selector — shown if no role set, or always as a "switch" section */}
                  {!currentRole ? (
                    <>
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal py-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" /> Who are you on Baytna?
                      </DropdownMenuLabel>
                      {ROLES.map(r => (
                        <DropdownMenuItem
                          key={r.value}
                          onClick={() => setRole(r.value)}
                          className="gap-3 py-2.5 cursor-pointer"
                        >
                          <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                            {r.icon}
                          </span>
                          <span className="flex flex-col">
                            <span className="text-sm font-medium">{r.label}</span>
                            <span className="text-xs text-muted-foreground">{r.description}</span>
                          </span>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">Switch role</DropdownMenuLabel>
                      {ROLES.filter(r => r.value !== currentRole).map(r => (
                        <DropdownMenuItem
                          key={r.value}
                          onClick={() => setRole(r.value)}
                          className="gap-2 text-sm text-muted-foreground cursor-pointer"
                        >
                          {r.icon} {r.label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="gap-2 flex items-center cursor-pointer">
                      <Heart className="w-4 h-4" /> My Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button size="sm" onClick={login} className="rounded-full px-5 gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          {!isLoading && isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage src={user.profileImageUrl ?? undefined} />
                  <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  {badge && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                      {badge.icon} {badge.label}
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="gap-2 flex items-center cursor-pointer">
                    <Heart className="w-4 h-4" /> My Favorites
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!isLoading && !isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={login} className="gap-1.5">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-serif font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="text-lg font-serif font-medium text-destructive transition-colors hover:opacity-80 text-left"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    onClick={login}
                    className="text-lg font-serif font-medium text-primary transition-colors hover:opacity-80 text-left"
                  >
                    Sign In
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
