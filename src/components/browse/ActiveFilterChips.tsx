import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  q: string;
  city: string;
  propertyType: string;
  listingType: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minBeds: number | undefined;

  setQ: React.Dispatch<React.SetStateAction<string>>;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  setPropertyType: React.Dispatch<React.SetStateAction<string>>;
  setListingType: React.Dispatch<React.SetStateAction<string>>;
  setMinPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMaxPrice: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMinBeds: React.Dispatch<React.SetStateAction<number | undefined>>;

  applyFilters: (overrides?: {
  q?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
}) => void;
  clearFilters: () => void;
};

export default function ActiveFilterChips({
  q,
  city,
  propertyType,
  listingType,
  minPrice,
  maxPrice,
  minBeds,
  setQ,
  setCity,
  setPropertyType,
  setListingType,
  setMinPrice,
  setMaxPrice,
  setMinBeds,
  applyFilters,
  clearFilters,
}: Props) {
const hasFilters =
  q ||
  city ||
  propertyType ||
  listingType ||
  minPrice ||
  maxPrice ||
  minBeds;

if (!hasFilters) return null;    
  return (
    <div className="flex flex-wrap gap-2 mb-6">
{q && (
  <Button
    variant="secondary"
    size="sm"
    className="rounded-full"
    onClick={() => {
      setQ("");
      applyFilters({ q: "" });
    }}
  >
    🔍 {q}
    <X className="w-3 h-3 ml-2" />
  </Button>
)}
  {city && (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full"
      onClick={() => {
  setCity("");
  applyFilters({ city: "" });
}}
    >
      📍 {city}
      <X className="w-3 h-3 ml-2" />
    </Button>
  )}
{listingType && listingType !== "all" && (
  <Button
    variant="secondary"
    size="sm"
    className="rounded-full"
    onClick={() => {
      setListingType("");
      applyFilters({ listingType: "" });
    }}
  >
    🏷 {listingType}
    <X className="w-3 h-3 ml-2" />
  </Button>
)}
{propertyType && propertyType !== "all" && (
  <Button
    variant="secondary"
    size="sm"
    className="rounded-full"
    onClick={() => {
      setPropertyType("");
      applyFilters({ propertyType: "" });
    }}
  >
    🏠 {propertyType}
    <X className="w-3 h-3 ml-2" />
  </Button>
)}
{minPrice && (
  <Button
    variant="secondary"
    size="sm"
    className="rounded-full"
    onClick={() => {
      setMinPrice(undefined);
      applyFilters({ minPrice: undefined });
    }}
  >
    💰 Min ₦{minPrice.toLocaleString()}
    <X className="w-3 h-3 ml-2" />
  </Button>
)}
{maxPrice && (
  <Button
    variant="secondary"
    size="sm"
    className="rounded-full"
    onClick={() => {
      setMaxPrice(undefined);
      applyFilters({ maxPrice: undefined });
    }}
  >
    💵 Max ₦{maxPrice.toLocaleString()}
    <X className="w-3 h-3 ml-2" />
  </Button>
)}
{minBeds && (
  <Button
    variant="secondary"
    size="sm"
    className="rounded-full"
    onClick={() => {
      setMinBeds(undefined);
      applyFilters({ minBeds: undefined });
    }}
  >
    🛏 {minBeds}+ Beds
    <X className="w-3 h-3 ml-2" />
  </Button>
)}
  <Button
    variant="ghost"
    size="sm"
    onClick={clearFilters}
  >
    Clear All
  </Button>

</div>
  );
}