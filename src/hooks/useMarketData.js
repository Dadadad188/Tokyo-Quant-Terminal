import useSWR from "swr";
import { fetchMarketData } from "../data/marketData";
import { usePageVisibility } from "./usePageVisibility";

function normalizeOptions(options) {
  if (typeof options === "number") return { refreshInterval: options };
  return options ?? {};
}

function isVolatilityAboveThreshold(data, threshold) {
  if (!threshold || !data?.indices?.length) return true;
  return data.indices.some((index) => Math.abs(Number(index.changePct)) >= threshold);
}

export function useMarketData(options) {
  const { refreshInterval = 60_000, enabled = true, volatilityThreshold = 0 } = normalizeOptions(options);
  const isVisible = usePageVisibility();
  const shouldPoll = enabled && isVisible;

  const { data, error, isLoading, isValidating, mutate } = useSWR("tokyo-market-data", fetchMarketData, {
    dedupingInterval: 1_000,
    focusThrottleInterval: 2_000,
    keepPreviousData: true,
    revalidateOnFocus: enabled,
    revalidateOnReconnect: enabled,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    refreshInterval: (latestData) => {
      if (!shouldPoll) return 0;
      if (!isVolatilityAboveThreshold(latestData, volatilityThreshold)) return 0;
      return refreshInterval;
    },
  });

  return {
    marketData: data,
    loading: isLoading,
    validating: isValidating,
    error: error instanceof Error ? error.message : error ? "Market data request failed" : "",
    reload: () => mutate(),
    isVisible,
    polling: shouldPoll,
  };
}
