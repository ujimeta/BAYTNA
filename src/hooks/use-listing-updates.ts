import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListPropertiesQueryKey, getListFeaturedPropertiesQueryKey } from "@/lib/api-client";

export interface ListingUpdate {
  count: number;
  latest: { id: number; title: string; price: number; city: string };
}

export function useListingUpdates() {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<ListingUpdate | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    const url = `${base}/api/properties/events`;
    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as {
          type: string;
          count: number;
          latest: { id: number; title: string; price: number; city: string };
        };
        if (data.type === "new_listing") {
          setPending({ count: data.count, latest: data.latest });
        }
      } catch {}
    };

    es.onerror = () => {
      es.close();
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getListPropertiesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListFeaturedPropertiesQueryKey() });
    setPending(null);
  }, [queryClient]);

  const dismiss = useCallback(() => {
    setPending(null);
  }, []);

  return { pending, refresh, dismiss };
}
