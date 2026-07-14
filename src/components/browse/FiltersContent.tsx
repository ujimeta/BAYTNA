import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

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

  applyFilters: () => void;
  clearFilters: () => void;
};

export default function FiltersContent({
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
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label>Search</Label>
        <Input
          placeholder="Keywords, neighborhood..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label>City</Label>
        <Input
          placeholder="e.g. Lagos, Kano"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <Separator />

      {/* Listing Type */}
      <div className="space-y-2">
        <Label>Listing Type</Label>
        <Select
          value={listingType || "all"}
          onValueChange={setListingType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="shortlet">Short Let</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label>Property Type</Label>

        <Select
          value={propertyType || "all"}
          onValueChange={setPropertyType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="condo">Apartment</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="loft">Loft</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price */}
      <div className="space-y-4">
        <Label>Price Range (₦)</Label>

        <div className="grid grid-cols-2 gap-4">

          <Input
            type="number"
            placeholder="Minimum"
            value={minPrice ?? ""}
            onChange={(e) =>
              setMinPrice(
                e.target.value
                  ? Number(e.target.value)
                  : undefined
              )
            }
          />

          <Input
            type="number"
            placeholder="Maximum"
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(
                e.target.value
                  ? Number(e.target.value)
                  : undefined
              )
            }
          />

        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">

        <Label>Minimum Beds</Label>

        <Select
          value={minBeds ? String(minBeds) : "any"}
          onValueChange={(v) =>
            setMinBeds(v === "any" ? undefined : Number(v))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">

        <Button
          className="flex-1"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>

        <Button
          variant="outline"
          onClick={clearFilters}
        >
          Clear
        </Button>

      </div>
    </div>
  );
}