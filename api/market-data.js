const indexInstruments = [
  { stooq: "^nkx", yahoo: "^N225", symbol: "N225", name: "Nikkei 225", fallbackPrice: 65158.19, fallbackOpen: 63658.95 },
  { stooq: "^tpx", yahoo: "^TOPX", symbol: "TOPIX", name: "TOPIX", fallbackPrice: 3942.57, fallbackOpen: 3903.54 },
];

const stockInstruments = [
  { stooq: "8035.jp", yahoo: "8035.T", code: "8035.T", name: "Tokyo Electron", sector: "Semi", marketCap: 36, fallbackPrice: 49830, fallbackOpen: 49050, fallbackVolume: 2776900 },
  { stooq: "7203.jp", yahoo: "7203.T", code: "7203.T", name: "Toyota", sector: "Auto", marketCap: 71, fallbackPrice: 2987, fallbackOpen: 3020, fallbackVolume: 16498800 },
  { stooq: "9984.jp", yahoo: "9984.T", code: "9984.T", name: "SoftBank Group", sector: "Tech", marketCap: 54, fallbackPrice: 6757, fallbackOpen: 6700, fallbackVolume: 103280800 },
  { stooq: "6857.jp", yahoo: "6857.T", code: "6857.T", name: "Advantest", sector: "Semi", marketCap: 32, fallbackPrice: 20280, fallbackOpen: 19545 },
  { stooq: "8306.jp", yahoo: "8306.T", code: "8306.T", name: "MUFG", sector: "Banks", marketCap: 34, fallbackPrice: 2263, fallbackOpen: 2265 },
  { stooq: "6758.jp", yahoo: "6758.T", code: "6758.T", name: "Sony", sector: "Tech", marketCap: 38, fallbackPrice: 3988, fallbackOpen: 3990 },
  { stooq: "6861.jp", yahoo: "6861.T", code: "6861.T", name: "Keyence", sector: "Factory", marketCap: 32, fallbackPrice: 63460, fallbackOpen: 62600 },
  { stooq: "9432.jp", yahoo: "9432.T", code: "9432.T", name: "NTT", sector: "Telecom", marketCap: 31, fallbackPrice: 158.7, fallbackOpen: 158.1 },
  { stooq: "7974.jp", yahoo: "7974.T", code: "7974.T", name: "Nintendo", sector: "Games", marketCap: 26, fallbackPrice: 13010, fallbackOpen: 12895 },
  { stooq: "4502.jp", yahoo: "4502.T", code: "4502.T", name: "Takeda", sector: "Pharma", marketCap: 23, fallbackPrice: 4822, fallbackOpen: 4829 },
  { stooq: "8058.jp", yahoo: "8058.T", code: "8058.T", name: "Mitsubishi", sector: "Trading", marketCap: 22, fallbackPrice: 3574, fallbackOpen: 3558 },
  { stooq: "6098.jp", yahoo: "6098.T", code: "6098.T", name: "Recruit", sector: "Services", marketCap: 21, fallbackPrice: 8552, fallbackOpen: 8428 },
  { stooq: "4063.jp", yahoo: "4063.T", code: "4063.T", name: "Shin-Etsu", sector: "Materials", marketCap: 20, fallbackPrice: 5120, fallbackOpen: 5079 },
];

let cachedPayload = null;
let cachedUntil = 0;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function round(value, digits = 4) {
  return Number(Number(value).toFixed(digits));
}

function parseCsvLine(line) {
  return line.split(",").map((cell) => cell.trim());
}

function parseStooqQuote(csv) {
  const [, row] = csv.trim().split(/\r?\n/);
  if (!row) return null;

  const [symbol, date, time, open, high, low, close, volume] = parseCsvLine(row);
  const openPrice = toNumber(open);
  const closePrice = toNumber(close);
  if (!symbol || date === "N/D" || !openPrice || !closePrice) return null;

  const change = closePrice - openPrice;
  const changePct = (change / openPrice) * 100;
  const volumeValue = toNumber(volume) ?? 0;

  return {
    sourceSymbol: symbol,
    date,
    time,
    lastPrice: round(closePrice),
    openPrice: round(openPrice),
    highPrice: round(toNumber(high) ?? closePrice),
    lowPrice: round(toNumber(low) ?? closePrice),
    change: round(change),
    changePct: round(changePct),
    volume: volumeValue,
    turnover: volumeValue * closePrice,
    asOf: `Stooq ${date} ${time}`,
    tooltipDate: date,
  };
}

async function fetchStooqQuote(symbol) {
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv&_=${Date.now()}`;
  const response = await fetch(url, {
    headers: { "user-agent": "Tokyo-Quant-Terminal/1.0" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Stooq quote failed for ${symbol}`);
  return parseStooqQuote(await response.text());
}

function parseYahooQuote(payload) {
  const result = payload?.chart?.result?.[0];
  const meta = result?.meta ?? {};
  const lastPrice = toNumber(meta.regularMarketPrice);
  const previousClose = toNumber(meta.chartPreviousClose ?? meta.previousClose);
  if (!lastPrice || !previousClose) return null;

  const change = lastPrice - previousClose;
  const volumeValue = toNumber(meta.regularMarketVolume) ?? 0;
  const timestamp = meta.regularMarketTime;
  const date = timestamp ? new Date(timestamp * 1000).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

  return {
    sourceSymbol: meta.symbol,
    date,
    time: timestamp ? new Date(timestamp * 1000).toISOString().slice(11, 19) : "",
    lastPrice: round(lastPrice),
    openPrice: round(previousClose),
    highPrice: round(toNumber(meta.regularMarketDayHigh) ?? lastPrice),
    lowPrice: round(toNumber(meta.regularMarketDayLow) ?? lastPrice),
    change: round(change),
    changePct: round((change / previousClose) * 100),
    volume: volumeValue,
    turnover: volumeValue * lastPrice,
    asOf: `Yahoo ${date}`,
    tooltipDate: date,
  };
}

async function fetchYahooQuote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m&includePrePost=false&_=${Date.now()}`;
  const response = await fetch(url, {
    headers: { "user-agent": "Tokyo-Quant-Terminal/1.0" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Yahoo quote failed for ${symbol}`);
  return parseYahooQuote(await response.json());
}

function createFallbackQuote(instrument) {
  if (!instrument.fallbackPrice || !instrument.fallbackOpen) return null;

  const change = instrument.fallbackPrice - instrument.fallbackOpen;
  const changePct = (change / instrument.fallbackOpen) * 100;
  const volume = instrument.fallbackVolume ?? 0;

  return {
    sourceSymbol: instrument.yahoo ?? instrument.stooq,
    date: "2026-05-25",
    time: "00:00:00",
    lastPrice: round(instrument.fallbackPrice),
    openPrice: round(instrument.fallbackOpen),
    highPrice: round(Math.max(instrument.fallbackPrice, instrument.fallbackOpen)),
    lowPrice: round(Math.min(instrument.fallbackPrice, instrument.fallbackOpen)),
    change: round(change),
    changePct: round(changePct),
    volume,
    turnover: volume * instrument.fallbackPrice,
    asOf: "Fallback 2026-05-25",
    tooltipDate: "2026-05-25",
  };
}

async function quoteInstrument(instrument) {
  try {
    const quote = await fetchStooqQuote(instrument.stooq);
    return quote ? { ...instrument, ...quote } : null;
  } catch {
    try {
      const quote = await fetchYahooQuote(instrument.yahoo);
      return quote ? { ...instrument, ...quote } : null;
    } catch {
      const quote = createFallbackQuote(instrument);
      return quote ? { ...instrument, ...quote } : null;
    }
  }
}

export async function getMarketData({ maxAgeMs = 30_000 } = {}) {
  const now = Date.now();
  if (cachedPayload && now < cachedUntil) return cachedPayload;

  const [indices, stocks] = await Promise.all([
    Promise.all(indexInstruments.map(quoteInstrument)),
    Promise.all(stockInstruments.map(quoteInstrument)),
  ]);

  cachedPayload = {
    source: [...indices, ...stocks].some((quote) => quote?.asOf?.startsWith("Stooq"))
      ? "Stooq"
      : [...indices, ...stocks].some((quote) => quote?.asOf?.startsWith("Yahoo"))
        ? "Yahoo Finance"
        : "Fallback",
    fetchedAt: new Date().toISOString(),
    indices: indices.filter(Boolean),
    stocks: stocks.filter(Boolean),
  };
  cachedUntil = now + maxAgeMs;

  return cachedPayload;
}

export default async function handler(_request, response) {
  try {
    const payload = await getMarketData();
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    response.status(200).json(payload);
  } catch {
    response.status(502).json({ error: "Unable to fetch market data" });
  }
}
