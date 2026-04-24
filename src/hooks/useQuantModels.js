import { useMemo } from "react";

export function useQuantModels(marketData) {
  return useMemo(() => {
    const inputs = marketData?.modelInputs ?? {};
    const pe = Number(inputs.nikkeiPe ?? 0);
    const peMean = Number(inputs.nikkeiPeFiveYearMean ?? pe);
    const peStdDev = Number(inputs.nikkeiPeStdDev ?? 1);
    const jgb10y = Number(inputs.jgb10yYield ?? 0);
    const earningsYield = pe > 0 ? (1 / pe) * 100 : 0;
    const erp = earningsYield - jgb10y;
    const peZScore = peStdDev > 0 ? (pe - peMean) / peStdDev : 0;

    return {
      earningsYield,
      erp,
      erpSignal: erp > 5 ? "Strong Buy Signal" : "Neutral",
      jgb10y,
      pe,
      peZScore,
    };
  }, [marketData]);
}
