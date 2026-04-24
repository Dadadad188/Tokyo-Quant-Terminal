const sectorDefinitions = [
  { key: "Fishery, Agriculture & Forestry", name: "Fishery & Forestry" },
  { key: "Mining", name: "Mining" },
  { key: "Construction", name: "Construction" },
  { key: "Foods", name: "Foods" },
  { key: "Textiles & Apparels", name: "Textiles & Apparel" },
  { key: "Pulp & Paper", name: "Pulp & Paper" },
  { key: "Chemicals", name: "Chemicals" },
  { key: "Pharmaceutical", name: "Pharmaceuticals" },
  { key: "Oil & Coal Products", name: "Oil & Coal" },
  { key: "Rubber Products", name: "Rubber Products" },
  { key: "Glass & Ceramics", name: "Glass & Ceramics" },
  { key: "Iron & Steel", name: "Iron & Steel" },
  { key: "Nonferrous Metals", name: "Nonferrous Metals" },
  { key: "Metal Products", name: "Metal Products" },
  { key: "Machinery", name: "Machinery" },
  { key: "Electric Appliances", name: "Electric Appliances" },
  { key: "Transportation Equipment", name: "Transport Equipment" },
  { key: "Precision Instruments", name: "Precision Instruments" },
  { key: "Other Products", name: "Other Products" },
  { key: "Electric Power & Gas", name: "Power & Gas" },
  { key: "Land Transportation", name: "Land Transport" },
  { key: "Marine Transportation", name: "Marine Transport" },
  { key: "Air Transportation", name: "Air Transport" },
  { key: "Warehousing & Harbor", name: "Warehousing & Harbor" },
  { key: "Information & Communication", name: "Information & Communication" },
  { key: "Wholesale Trade", name: "Wholesale Trade" },
  { key: "Retail Trade", name: "Retail Trade" },
  { key: "Banks", name: "Banks" },
  { key: "Securities & Commodities", name: "Securities & Commodities" },
  { key: "Insurance", name: "Insurance" },
  { key: "Other Financing Business", name: "Other Financials" },
  { key: "Real Estate", name: "Real Estate" },
  { key: "Services", name: "Services" },
];

const weightedStocksBySector = {
  "Transportation Equipment": [
    { code: "7203.T", name: "Toyota Motor", weight: 31.4, changePct: 1.42, turnover: 142.8 },
    { code: "7267.T", name: "Honda Motor", weight: 13.8, changePct: 0.72, turnover: 54.6 },
    { code: "7201.T", name: "Nissan Motor", weight: 6.9, changePct: -0.58, turnover: 32.1 },
    { code: "6902.T", name: "Denso", weight: 6.2, changePct: 1.11, turnover: 39.7 },
  ],
  "Information & Communication": [
    { code: "9984.T", name: "SoftBank Group", weight: 21.7, changePct: -1.86, turnover: 188.3 },
    { code: "9432.T", name: "NTT", weight: 18.4, changePct: 0.34, turnover: 91.2 },
    { code: "9433.T", name: "KDDI", weight: 11.9, changePct: 0.55, turnover: 36.8 },
    { code: "4755.T", name: "Rakuten Group", weight: 3.1, changePct: 2.28, turnover: 44.2 },
  ],
  "Electric Appliances": [
    { code: "6758.T", name: "Sony Group", weight: 18.9, changePct: 1.18, turnover: 126.4 },
    { code: "8035.T", name: "Tokyo Electron", weight: 16.6, changePct: -0.94, turnover: 209.5 },
    { code: "6861.T", name: "Keyence", weight: 14.2, changePct: 0.88, turnover: 102.9 },
    { code: "6501.T", name: "Hitachi", weight: 10.8, changePct: 1.53, turnover: 88.4 },
  ],
  Banks: [
    { code: "8306.T", name: "Mitsubishi UFJ", weight: 29.1, changePct: -0.42, turnover: 156.7 },
    { code: "8316.T", name: "Sumitomo Mitsui", weight: 19.8, changePct: -0.12, turnover: 74.1 },
    { code: "8411.T", name: "Mizuho Financial", weight: 15.7, changePct: 0.21, turnover: 62.3 },
    { code: "8309.T", name: "Sumitomo Mitsui Trust", weight: 5.2, changePct: -0.65, turnover: 18.9 },
  ],
  "Other Products": [
    { code: "7974.T", name: "Nintendo", weight: 36.2, changePct: 1.96, turnover: 118.1 },
    { code: "7832.T", name: "Bandai Namco", weight: 9.7, changePct: 0.47, turnover: 25.4 },
    { code: "6988.T", name: "Nitto Denko", weight: 6.1, changePct: -0.32, turnover: 16.8 },
    { code: "7951.T", name: "Yamaha", weight: 3.8, changePct: 0.16, turnover: 8.7 },
  ],
};

const defaultStocks = [
  { code: "4063.T", name: "Shin-Etsu Chemical", weight: 11.5, changePct: 0.78, turnover: 51.6 },
  { code: "4502.T", name: "Takeda Pharmaceutical", weight: 10.1, changePct: -0.24, turnover: 34.9 },
  { code: "8058.T", name: "Mitsubishi Corp", weight: 8.7, changePct: 0.61, turnover: 43.2 },
  { code: "6098.T", name: "Recruit Holdings", weight: 7.9, changePct: 1.37, turnover: 67.5 },
];

function createSectorData() {
  return sectorDefinitions.map(({ key, name }, index) => {
    const wave = Math.sin(index * 0.77);
    const cycle = Math.cos(index * 0.41);
    const changePct = Number((wave * 1.65 + cycle * 0.58).toFixed(2));
    const valuationPercentile = Math.max(12, Math.min(94, Math.round(52 + wave * 28 + cycle * 13)));
    const volumeHeat = Math.max(18, Math.min(99, Math.round(58 + cycle * 27 - wave * 9)));

    return {
      id: key,
      key,
      name,
      changePct,
      valuationPercentile,
      volumeHeat,
      stocks: weightedStocksBySector[key] ?? defaultStocks,
    };
  });
}

function createBreadthHistogram() {
  const bins = ["<-5", "-5~-4", "-4~-3", "-3~-2", "-2~-1", "-1~0", "0~1", "1~2", "2~3", "3~4", "4~5", ">5"];
  const counts = [36, 58, 91, 142, 231, 384, 423, 302, 168, 88, 49, 27];
  return bins.map((bin, index) => ({
    bin,
    count: counts[index],
    tone: index < 6 ? "down" : "up",
  }));
}

function createAdLine() {
  const labels = ["09:00", "09:30", "10:00", "10:30", "11:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"];
  const values = [0, 78, 124, 96, 181, 208, 264, 241, 318, 356, 402];
  return labels.map((time, index) => ({ time, value: values[index] }));
}

const heatmapStocks = [
  { code: "7203.T", name: "Toyota", sector: "Auto", marketCap: 71, changePct: 1.42 },
  { code: "9984.T", name: "SoftBank", sector: "Tech", marketCap: 54, changePct: -1.86 },
  { code: "6758.T", name: "Sony", sector: "Tech", marketCap: 38, changePct: 1.18 },
  { code: "8035.T", name: "Tokyo Electron", sector: "Semi", marketCap: 36, changePct: -0.94 },
  { code: "8306.T", name: "MUFG", sector: "Banks", marketCap: 34, changePct: -0.42 },
  { code: "6861.T", name: "Keyence", sector: "Factory", marketCap: 32, changePct: 0.88 },
  { code: "9432.T", name: "NTT", sector: "Telecom", marketCap: 31, changePct: 0.34 },
  { code: "7974.T", name: "Nintendo", sector: "Games", marketCap: 26, changePct: 1.96 },
  { code: "4502.T", name: "Takeda", sector: "Pharma", marketCap: 23, changePct: -0.24 },
  { code: "8058.T", name: "Mitsubishi", sector: "Trading", marketCap: 22, changePct: 0.61 },
  { code: "6098.T", name: "Recruit", sector: "Services", marketCap: 21, changePct: 1.37 },
  { code: "4063.T", name: "Shin-Etsu", sector: "Materials", marketCap: 20, changePct: 0.78 },
];

const macroIndicators = [
  { label: "USD/JPY", value: "156.42", change: "+0.18%", tone: "up" },
  { label: "JGB 10Y", value: "1.08%", change: "+1.6bps", tone: "up" },
  { label: "S&P 500 Fut", value: "6,412.25", change: "-0.22%", tone: "down" },
  { label: "Brent", value: "83.10", change: "+0.41%", tone: "up" },
  { label: "SOX Fut", value: "5,612.4", change: "+0.34%", tone: "up" },
  { label: "VIX", value: "16.9", change: "-0.6", tone: "down" },
];

const breadthSummary = {
  advancing: 1238,
  declining: 812,
  unchanged: 148,
};

const attributionTop5 = [
  { code: "8035.T", name: "Tokyo Electron", contribution: 121.4, changePct: 2.86 },
  { code: "9984.T", name: "SoftBank Group", contribution: 103.8, changePct: 1.74 },
  { code: "6857.T", name: "Advantest", contribution: 78.2, changePct: 3.41 },
  { code: "6954.T", name: "Fanuc", contribution: -24.7, changePct: -0.82 },
  { code: "7203.T", name: "Toyota Motor", contribution: 21.6, changePct: 0.46 },
];

const nikkeiVi = {
  value: 18.7,
  change: -0.8,
  percentile: 62,
  regime: "Historical volatility percentile: 62%",
};

const correlationMonitor = {
  pair: "USD/JPY × N225",
  window: "20D",
  value: 0.68,
  delta: 0.09,
  reading: "Elevated FX sensitivity",
};

const styleFlow = {
  valueScore: 44,
  growthScore: 56,
  label: "Growth factor leadership",
};

const liveFeed = [
  { code: "8035.T", name: "Tokyo Electron", price: "¥43,280", change: "+2.86%" },
  { code: "7203.T", name: "Toyota", price: "¥3,241", change: "+0.46%" },
  { code: "9984.T", name: "SoftBank Group", price: "¥12,845", change: "+1.74%" },
  { code: "6857.T", name: "Advantest", price: "¥9,726", change: "+3.41%" },
  { code: "8306.T", name: "MUFG", price: "¥2,148", change: "-0.38%" },
  { code: "6758.T", name: "Sony", price: "¥4,071", change: "+1.08%" },
];

const nikkeiPe = 16.4;
const jgb10yYield = 1.08;
const erpValue = Number(((1 / nikkeiPe) * 100 - jgb10yYield).toFixed(2));
const erpMonitor = {
  value: erpValue,
  earningsYield: Number(((1 / nikkeiPe) * 100).toFixed(2)),
  jgb10y: jgb10yYield,
  signal: erpValue > 5 ? "Strong Buy Signal" : "Neutral",
};

const volatilityTermStructure = [
  { tenor: "1M VI", vol: 18.7 },
  { tenor: "2M Fwd", vol: 19.4 },
  { tenor: "3M Fwd", vol: 19.9 },
  { tenor: "6M Fwd", vol: 20.8 },
  { tenor: "12M Fwd", vol: 21.5 },
];

const governanceMonitor = {
  pbCleanupProgress: 61.4,
  remainingBelowBook: 38.6,
  buybackToday: "¥428.6B",
  buybackCount: 17,
};

const modelInputs = {
  nikkeiPe,
  nikkeiPeFiveYearMean: 15.2,
  nikkeiPeStdDev: 1.0,
  jgb10yYield,
};

function getTokyoClockParts() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });

  return Object.fromEntries(formatter.formatToParts(new Date()).map((part) => [part.type, part.value]));
}

function formatTokyoDisplayDate(parts) {
  const monthName = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "Asia/Tokyo" }).format(new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00+09:00`));
  return `${Number(parts.day)} ${monthName} ${parts.year}`;
}

function getTokyoMarketClock() {
  const parts = getTokyoClockParts();
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const minutes = hour * 60 + minute;
  const isWeekend = parts.weekday === "Sat" || parts.weekday === "Sun";
  let marketStatus = "MARKET CLOSED";

  if (isWeekend) {
    marketStatus = "MARKET HOLIDAY";
  } else if (minutes < 9 * 60) {
    marketStatus = "PRE-MARKET";
  } else if (minutes >= 9 * 60 && minutes < 11 * 60 + 30) {
    marketStatus = "LIVE MARKET";
  } else if (minutes >= 11 * 60 + 30 && minutes < 12 * 60 + 30) {
    marketStatus = "MIDDAY BREAK";
  } else if (minutes >= 12 * 60 + 30 && minutes < 15 * 60 + 30) {
    marketStatus = "LIVE MARKET";
  }

  return {
    marketStatus,
    updatedAt: `${formatTokyoDisplayDate(parts)}, ${parts.hour}:${parts.minute} JST`,
  };
}

export async function fetchMarketData() {
  await new Promise((resolve) => setTimeout(resolve, 260));
  const marketClock = getTokyoMarketClock();

  return {
    updatedAt: marketClock.updatedAt,
    marketStatus: marketClock.marketStatus,
    sentiment: 64,
    macroIndicators,
    nikkeiVi,
    attributionTop5,
    correlationMonitor,
    styleFlow,
    liveFeed,
    modelInputs,
    erpMonitor,
    volatilityTermStructure,
    governanceMonitor,
    indices: [
      {
        symbol: "N225",
        name: "Nikkei 225",
        value: 59716.18,
        change: 575.95,
        changePct: 0.97,
        asOf: "Close 24 Apr 2026",
        tooltipDate: "25 Apr 2026",
        intraday: [59140, 59260, 59235, 59380, 59445, 59410, 59520, 59610, 59585, 59670, 59716.18],
        realtimePe: {
          value: "16.4x",
          context: "vs. 5Y Historical Mean +1.2 Std Dev (sigma)",
        },
      },
      {
        symbol: "TOPIX",
        name: "TOPIX",
        value: 3716.59,
        change: 0.21,
        changePct: 0.01,
        asOf: "Close 24 Apr 2026",
        tooltipDate: "25 Apr 2026",
        intraday: [3714.8, 3718.2, 3717.4, 3715.9, 3719.1, 3716.6, 3718.5, 3716.1, 3717.2, 3715.8, 3716.59],
      },
    ],
    metrics: [
      {
        key: "pe",
        label: "Average P/E Ratio",
        value: 16.8,
        suffix: "x",
        delta: 0.7,
        context: "10Y historical mean 15.9x",
        detail: "5.70% above long-run mean",
      },
      {
        key: "pb",
        label: "Average P/B Ratio",
        value: 1.34,
        suffix: "x",
        delta: -0.04,
        context: "Below-book ratio 38.60%",
        detail: "Banks, steel and real estate drive the discount",
      },
      {
        key: "dividend",
        label: "Dividend Yield",
        value: 2.41,
        suffix: "%",
        delta: 0.08,
        context: "TSE Prime market average",
        detail: "24bps above 5Y historical mean",
      },
      {
        key: "foreign",
        label: "Net Foreign Inflow",
        value: 184.7,
        suffix: "B JPY",
        delta: 62.3,
        context: "Week-to-date +612.4B JPY",
        detail: "Third consecutive cash equity net-buying session",
      },
    ],
    sectors: createSectorData(),
    breadthHistogram: createBreadthHistogram(),
    breadthSummary,
    adLine: createAdLine(),
    heatmapStocks,
  };
}
