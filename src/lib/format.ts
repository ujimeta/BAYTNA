export function formatPrice(price: number, type: "sale" | "rent" | "shortlet" = "sale") {
  let formatted: string;
  if (price >= 1_000_000_000) {
    const val = price / 1_000_000_000;
    formatted = `₦${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2).replace(/\.?0+$/, "")}B`;
  } else if (price >= 1_000_000) {
    const val = price / 1_000_000;
    formatted = `₦${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, "")}M`;
  } else if (price >= 1_000) {
    const val = price / 1_000;
    formatted = `₦${val % 1 === 0 ? val.toFixed(0) : val.toFixed(0)}K`;
  } else {
    formatted = `₦${price.toLocaleString("en-NG")}`;
  }
  if (type === "rent") return `${formatted}/mo`;
  if (type === "shortlet") return `${formatted}/night`;
  return formatted;
}

export function formatSqft(sqft: number) {
  return new Intl.NumberFormat("en-NG").format(sqft);
}
