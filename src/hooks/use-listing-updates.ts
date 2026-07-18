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
    // Live updates temporarily disabled.
    // We'll replace this with Firebase Firestore listeners later.
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
