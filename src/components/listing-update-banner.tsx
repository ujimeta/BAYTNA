import { Sparkles, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { ListingUpdate } from "@/hooks/use-listing-updates";

interface Props {
  update: ListingUpdate;
  onRefresh: () => void;
  onDismiss: () => void;
}

export function ListingUpdateBanner({ update, onRefresh, onDismiss }: Props) {
  const { count, latest } = update;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#2C4A2E] text-white rounded-full px-5 py-3 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <Sparkles className="w-4 h-4 shrink-0 text-[#C4A882]" />
      <span className="text-sm font-medium whitespace-nowrap">
        {count === 1
          ? <>New listing: <span className="text-[#C4A882]">{latest.city}</span> · {formatPrice(latest.price)}</>
          : <><span className="text-[#C4A882]">{count} new listings</span> just added</>
        }
      </span>
      <button
        onClick={onRefresh}
        className="ml-1 text-sm font-semibold underline underline-offset-2 hover:no-underline shrink-0"
      >
        View now
      </button>
      <button
        onClick={onDismiss}
        className="ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
