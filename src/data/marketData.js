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

const representativeStocksBySector = {
  ...weightedStocksBySector,
  "Fishery, Agriculture & Forestry": [
    { code: "1332.T", name: "Nissui", weight: 24.2, changePct: 0.36, turnover: 11.8 },
    { code: "1333.T", name: "Maruha Nichiro", weight: 22.4, changePct: -0.18, turnover: 8.7 },
    { code: "1377.T", name: "Sakata Seed", weight: 18.8, changePct: 0.64, turnover: 5.1 },
    { code: "1379.T", name: "Hokuto", weight: 10.1, changePct: -0.22, turnover: 2.4 },
  ],
  Mining: [
    { code: "1605.T", name: "INPEX", weight: 72.8, changePct: 0.92, turnover: 97.4 },
    { code: "1662.T", name: "Japan Petroleum", weight: 18.3, changePct: 0.48, turnover: 10.7 },
    { code: "1515.T", name: "Nittetsu Mining", weight: 4.9, changePct: -0.31, turnover: 1.9 },
    { code: "1518.T", name: "Mitsui Matsushima", weight: 4.0, changePct: 0.16, turnover: 1.5 },
  ],
  Construction: [
    { code: "1801.T", name: "Taisei", weight: 16.8, changePct: 0.74, turnover: 23.6 },
    { code: "1802.T", name: "Obayashi", weight: 15.2, changePct: 0.42, turnover: 21.9 },
    { code: "1803.T", name: "Shimizu", weight: 14.7, changePct: -0.28, turnover: 18.2 },
    { code: "1925.T", name: "Daiwa House", weight: 19.5, changePct: 0.31, turnover: 32.4 },
  ],
  Foods: [
    { code: "2502.T", name: "Asahi Group", weight: 17.4, changePct: -0.12, turnover: 21.3 },
    { code: "2503.T", name: "Kirin", weight: 15.1, changePct: 0.22, turnover: 17.8 },
    { code: "2802.T", name: "Ajinomoto", weight: 22.6, changePct: 0.58, turnover: 29.5 },
    { code: "2914.T", name: "Japan Tobacco", weight: 26.8, changePct: -0.36, turnover: 42.1 },
  ],
  "Textiles & Apparels": [
    { code: "3402.T", name: "Toray", weight: 28.6, changePct: 0.26, turnover: 19.1 },
    { code: "3401.T", name: "Teijin", weight: 9.7, changePct: -0.44, turnover: 6.8 },
    { code: "8111.T", name: "Goldwin", weight: 8.6, changePct: 0.72, turnover: 4.9 },
    { code: "8016.T", name: "Onward", weight: 6.3, changePct: 1.08, turnover: 3.2 },
  ],
  "Pulp & Paper": [
    { code: "3861.T", name: "Oji Holdings", weight: 39.5, changePct: -0.24, turnover: 11.6 },
    { code: "3863.T", name: "Nippon Paper", weight: 22.1, changePct: 0.18, turnover: 7.4 },
    { code: "3880.T", name: "Daio Paper", weight: 12.6, changePct: 0.41, turnover: 3.6 },
    { code: "3891.T", name: "Nippon Kodoshi", weight: 3.1, changePct: -0.62, turnover: 0.6 },
  ],
  Chemicals: [
    { code: "4063.T", name: "Shin-Etsu Chemical", weight: 21.4, changePct: 0.78, turnover: 51.6 },
    { code: "4188.T", name: "Mitsubishi Chemical", weight: 12.1, changePct: -0.16, turnover: 20.4 },
    { code: "4452.T", name: "Kao", weight: 11.8, changePct: 0.34, turnover: 24.7 },
    { code: "4911.T", name: "Shiseido", weight: 9.6, changePct: -0.82, turnover: 31.2 },
  ],
  Pharmaceutical: [
    { code: "4502.T", name: "Takeda Pharmaceutical", weight: 27.5, changePct: -0.24, turnover: 34.9 },
    { code: "4503.T", name: "Astellas Pharma", weight: 17.2, changePct: 0.19, turnover: 22.4 },
    { code: "4568.T", name: "Daiichi Sankyo", weight: 29.8, changePct: 0.61, turnover: 48.7 },
    { code: "4519.T", name: "Chugai Pharmaceutical", weight: 18.7, changePct: -0.37, turnover: 27.3 },
  ],
  "Oil & Coal Products": [
    { code: "5020.T", name: "ENEOS", weight: 46.1, changePct: 0.32, turnover: 39.2 },
    { code: "5019.T", name: "Idemitsu Kosan", weight: 28.4, changePct: 0.54, turnover: 22.8 },
    { code: "5017.T", name: "Fuji Oil", weight: 4.8, changePct: -0.18, turnover: 1.8 },
    { code: "5009.T", name: "Fuji Kosan", weight: 2.1, changePct: 0.07, turnover: 0.4 },
  ],
  "Rubber Products": [
    { code: "5108.T", name: "Bridgestone", weight: 52.7, changePct: 0.46, turnover: 36.8 },
    { code: "5110.T", name: "Sumitomo Rubber", weight: 14.2, changePct: -0.28, turnover: 7.1 },
    { code: "5101.T", name: "Yokohama Rubber", weight: 13.6, changePct: 0.31, turnover: 6.4 },
    { code: "5191.T", name: "Sumitomo Riko", weight: 5.2, changePct: 0.84, turnover: 2.1 },
  ],
  "Glass & Ceramics": [
    { code: "5201.T", name: "AGC", weight: 21.8, changePct: -0.21, turnover: 17.7 },
    { code: "5333.T", name: "NGK Insulators", weight: 16.5, changePct: 0.53, turnover: 10.9 },
    { code: "5332.T", name: "TOTO", weight: 12.4, changePct: -0.46, turnover: 9.6 },
    { code: "5214.T", name: "Nippon Electric Glass", weight: 8.1, changePct: 0.28, turnover: 5.2 },
  ],
  "Iron & Steel": [
    { code: "5401.T", name: "Nippon Steel", weight: 44.6, changePct: 0.18, turnover: 58.4 },
    { code: "5411.T", name: "JFE Holdings", weight: 22.2, changePct: -0.34, turnover: 29.6 },
    { code: "5406.T", name: "Kobe Steel", weight: 12.7, changePct: 0.67, turnover: 18.3 },
    { code: "5471.T", name: "Daido Steel", weight: 4.4, changePct: -0.19, turnover: 2.6 },
  ],
  "Nonferrous Metals": [
    { code: "5713.T", name: "Sumitomo Metal Mining", weight: 22.5, changePct: 0.73, turnover: 21.8 },
    { code: "5802.T", name: "Sumitomo Electric", weight: 23.1, changePct: 0.41, turnover: 25.6 },
    { code: "5801.T", name: "Furukawa Electric", weight: 9.2, changePct: -0.27, turnover: 8.1 },
    { code: "5711.T", name: "Mitsubishi Materials", weight: 8.8, changePct: 0.12, turnover: 7.5 },
  ],
  "Metal Products": [
    { code: "5938.T", name: "LIXIL", weight: 20.2, changePct: -0.38, turnover: 12.4 },
    { code: "5929.T", name: "Sanwa Holdings", weight: 15.6, changePct: 0.64, turnover: 8.9 },
    { code: "5901.T", name: "Toyo Seikan", weight: 13.4, changePct: 0.17, turnover: 6.7 },
    { code: "5947.T", name: "Rinnai", weight: 10.8, changePct: -0.09, turnover: 5.5 },
  ],
  Machinery: [
    { code: "6301.T", name: "Komatsu", weight: 24.8, changePct: 0.52, turnover: 34.2 },
    { code: "6367.T", name: "Daikin", weight: 22.4, changePct: -0.36, turnover: 41.7 },
    { code: "7011.T", name: "Mitsubishi Heavy", weight: 18.2, changePct: 1.14, turnover: 55.8 },
    { code: "6326.T", name: "Kubota", weight: 11.9, changePct: 0.21, turnover: 17.3 },
  ],
  "Precision Instruments": [
    { code: "7741.T", name: "HOYA", weight: 34.7, changePct: 0.39, turnover: 27.1 },
    { code: "7733.T", name: "Olympus", weight: 19.8, changePct: -0.44, turnover: 19.4 },
    { code: "4543.T", name: "Terumo", weight: 24.5, changePct: 0.28, turnover: 23.6 },
    { code: "7735.T", name: "SCREEN Holdings", weight: 9.3, changePct: 1.06, turnover: 21.7 },
  ],
  "Electric Power & Gas": [
    { code: "9501.T", name: "Tokyo Electric Power", weight: 18.4, changePct: -0.62, turnover: 21.1 },
    { code: "9503.T", name: "Kansai Electric", weight: 17.2, changePct: 0.18, turnover: 14.7 },
    { code: "9502.T", name: "Chubu Electric", weight: 12.8, changePct: 0.22, turnover: 9.8 },
    { code: "9531.T", name: "Tokyo Gas", weight: 15.7, changePct: -0.11, turnover: 13.5 },
  ],
  "Land Transportation": [
    { code: "9020.T", name: "JR East", weight: 21.7, changePct: 0.26, turnover: 19.9 },
    { code: "9022.T", name: "JR Central", weight: 18.4, changePct: -0.14, turnover: 16.2 },
    { code: "9021.T", name: "JR West", weight: 13.9, changePct: 0.35, turnover: 10.8 },
    { code: "9101.T", name: "Nippon Yusen", weight: 10.4, changePct: -0.41, turnover: 22.6 },
  ],
  "Marine Transportation": [
    { code: "9101.T", name: "Nippon Yusen", weight: 32.1, changePct: -0.41, turnover: 22.6 },
    { code: "9104.T", name: "Mitsui O.S.K. Lines", weight: 28.9, changePct: 0.62, turnover: 24.1 },
    { code: "9107.T", name: "Kawasaki Kisen", weight: 23.7, changePct: 0.18, turnover: 21.5 },
    { code: "9119.T", name: "Iino Kaiun", weight: 3.8, changePct: -0.13, turnover: 1.7 },
  ],
  "Air Transportation": [
    { code: "9202.T", name: "ANA Holdings", weight: 46.2, changePct: 0.21, turnover: 13.8 },
    { code: "9201.T", name: "Japan Airlines", weight: 42.7, changePct: -0.18, turnover: 12.6 },
    { code: "9204.T", name: "Skymark", weight: 3.2, changePct: 0.44, turnover: 0.8 },
    { code: "9232.T", name: "Pasco", weight: 1.7, changePct: -0.09, turnover: 0.3 },
  ],
  "Warehousing & Harbor": [
    { code: "9301.T", name: "Mitsubishi Logistics", weight: 25.1, changePct: 0.31, turnover: 6.9 },
    { code: "9302.T", name: "Mitsui-Soko", weight: 15.7, changePct: -0.24, turnover: 3.1 },
    { code: "9364.T", name: "Kamigumi", weight: 14.4, changePct: 0.17, turnover: 2.9 },
    { code: "9303.T", name: "Sumitomo Warehouse", weight: 10.9, changePct: 0.42, turnover: 2.1 },
  ],
  "Wholesale Trade": [
    { code: "8058.T", name: "Mitsubishi Corp", weight: 24.6, changePct: 0.61, turnover: 43.2 },
    { code: "8031.T", name: "Mitsui & Co", weight: 21.3, changePct: -0.22, turnover: 35.8 },
    { code: "8001.T", name: "Itochu", weight: 18.8, changePct: 0.38, turnover: 31.4 },
    { code: "8002.T", name: "Marubeni", weight: 12.7, changePct: 0.14, turnover: 23.9 },
  ],
  "Retail Trade": [
    { code: "9983.T", name: "Fast Retailing", weight: 34.8, changePct: 0.88, turnover: 63.4 },
    { code: "8267.T", name: "Aeon", weight: 12.2, changePct: -0.31, turnover: 15.1 },
    { code: "3382.T", name: "Seven & i", weight: 16.5, changePct: 0.27, turnover: 24.6 },
    { code: "3092.T", name: "ZOZO", weight: 5.1, changePct: 0.74, turnover: 6.2 },
  ],
  "Securities & Commodities": [
    { code: "8604.T", name: "Nomura Holdings", weight: 35.4, changePct: 0.49, turnover: 29.8 },
    { code: "8601.T", name: "Daiwa Securities", weight: 20.8, changePct: 0.21, turnover: 13.4 },
    { code: "8697.T", name: "Japan Exchange Group", weight: 24.2, changePct: -0.16, turnover: 18.9 },
    { code: "8473.T", name: "SBI Holdings", weight: 12.7, changePct: 0.82, turnover: 12.1 },
  ],
  Insurance: [
    { code: "8766.T", name: "Tokio Marine", weight: 34.1, changePct: 0.36, turnover: 37.8 },
    { code: "8725.T", name: "MS&AD", weight: 24.6, changePct: 0.22, turnover: 20.7 },
    { code: "8630.T", name: "Sompo Holdings", weight: 19.2, changePct: -0.12, turnover: 18.2 },
    { code: "8750.T", name: "Dai-ichi Life", weight: 15.8, changePct: 0.44, turnover: 16.9 },
  ],
  "Other Financing Business": [
    { code: "8591.T", name: "ORIX", weight: 31.2, changePct: 0.18, turnover: 27.6 },
    { code: "8253.T", name: "Credit Saison", weight: 12.8, changePct: -0.29, turnover: 7.8 },
    { code: "8570.T", name: "Aeon Financial", weight: 10.6, changePct: 0.37, turnover: 5.9 },
    { code: "8439.T", name: "Tokyo Century", weight: 8.1, changePct: 0.11, turnover: 4.2 },
  ],
  "Real Estate": [
    { code: "8801.T", name: "Mitsui Fudosan", weight: 26.5, changePct: -0.34, turnover: 28.1 },
    { code: "8802.T", name: "Mitsubishi Estate", weight: 22.7, changePct: -0.18, turnover: 22.5 },
    { code: "8830.T", name: "Sumitomo Realty", weight: 15.2, changePct: 0.26, turnover: 13.4 },
    { code: "3289.T", name: "Tokyu Fudosan", weight: 8.4, changePct: 0.63, turnover: 7.1 },
  ],
  Services: [
    { code: "6098.T", name: "Recruit Holdings", weight: 24.9, changePct: 1.37, turnover: 67.5 },
    { code: "4661.T", name: "Oriental Land", weight: 17.8, changePct: -0.42, turnover: 32.6 },
    { code: "2413.T", name: "M3", weight: 8.6, changePct: 0.58, turnover: 14.7 },
    { code: "9735.T", name: "SECOM", weight: 10.4, changePct: 0.19, turnover: 11.8 },
  ],
};

const indexQuotes = [
  { symbol: "N225", name: "Nikkei 225" },
  { symbol: "TOPIX", name: "TOPIX" },
];

const stockQuotes = [
  { code: "8035.T", name: "Tokyo Electron", sector: "Semi", marketCap: 36 },
  { code: "7203.T", name: "Toyota", sector: "Auto", marketCap: 71 },
  { code: "9984.T", name: "SoftBank Group", sector: "Tech", marketCap: 54 },
  { code: "6857.T", name: "Advantest", sector: "Semi", marketCap: 32 },
  { code: "8306.T", name: "MUFG", sector: "Banks", marketCap: 34 },
  { code: "6758.T", name: "Sony", sector: "Tech", marketCap: 38 },
  { code: "6861.T", name: "Keyence", sector: "Factory", marketCap: 32 },
  { code: "9432.T", name: "NTT", sector: "Telecom", marketCap: 31 },
  { code: "7974.T", name: "Nintendo", sector: "Games", marketCap: 26 },
  { code: "4502.T", name: "Takeda", sector: "Pharma", marketCap: 23 },
  { code: "8058.T", name: "Mitsubishi", sector: "Trading", marketCap: 22 },
  { code: "6098.T", name: "Recruit", sector: "Services", marketCap: 21 },
  { code: "4063.T", name: "Shin-Etsu", sector: "Materials", marketCap: 20 },
];

function createSectorData(quoteMap = new Map()) {
  return sectorDefinitions.map(({ key, name }, index) => {
    const wave = Math.sin(index * 0.77);
    const cycle = Math.cos(index * 0.41);
    const sourceStocks = representativeStocksBySector[key] ?? defaultStocks;
    const stocks = sourceStocks.map((stock) => {
      const quote = quoteMap.get(stock.code);
      return quote ? { ...stock, changePct: quote.changePct, turnover: quote.turnover ?? stock.turnover } : stock;
    });
    const liveWeight = stocks.reduce((sum, stock) => sum + (quoteMap.has(stock.code) ? stock.weight : 0), 0);
    const liveChange = liveWeight
      ? stocks.reduce((sum, stock) => sum + (quoteMap.has(stock.code) ? stock.changePct * stock.weight : 0), 0) / liveWeight
      : wave * 1.65 + cycle * 0.58;
    const liveTurnover = stocks.reduce((sum, stock) => sum + (quoteMap.has(stock.code) ? stock.turnover ?? 0 : 0), 0);
    const changePct = Number(liveChange.toFixed(2));
    const valuationPercentile = Math.max(12, Math.min(94, Math.round(52 + wave * 28 + cycle * 13)));
    const volumeHeat = liveTurnover
      ? Math.max(18, Math.min(99, Math.round(28 + Math.log10(liveTurnover + 1) * 10)))
      : Math.max(18, Math.min(99, Math.round(58 + cycle * 27 - wave * 9)));

    return {
      id: key,
      key,
      name,
      changePct,
      valuationPercentile,
      volumeHeat,
      stocks,
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

function compactNumber(value, digits = 2) {
  return Number(Number(value).toFixed(digits));
}

function signedPct(value) {
  return `${value >= 0 ? "+" : ""}${compactNumber(value, 2)}%`;
}

function formatYen(value) {
  return `¥${Math.round(value).toLocaleString("en-US")}`;
}

async function fetchLiveQuotes() {
  const response = await fetch(`/api/market-data?_=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Market data API request failed");

  const payload = await response.json();
  const entries = [
    ...(payload.indices ?? []).map((quote) => [quote.symbol, quote]),
    ...(payload.stocks ?? []).map((quote) => [quote.code, quote]),
  ];
  return { source: payload.source ?? "Live API", quoteMap: new Map(entries) };
}

function applyLiveQuotes(baseData, liveData) {
  const { source, quoteMap } = liveData;
  const stockQuoteByCode = new Map(stockQuotes.map((stock) => [stock.code, quoteMap.get(stock.code)]).filter(([, quote]) => quote));
  const indices = baseData.indices.map((index) => {
    const source = indexQuotes.find((quote) => quote.symbol === index.symbol);
    const liveQuote = source ? quoteMap.get(source.symbol) : null;
    if (!liveQuote) return index;

    return {
      ...index,
      value: compactNumber(liveQuote.lastPrice, 2),
      change: compactNumber(liveQuote.change, 2),
      changePct: compactNumber(liveQuote.changePct, 2),
      asOf: liveQuote.asOf,
      tooltipDate: liveQuote.tooltipDate,
    };
  });
  const liveStocks = stockQuotes.map((stock) => ({ ...stock, quote: quoteMap.get(stock.code) })).filter((stock) => stock.quote);

  if (!liveStocks.length && indices.every((index) => index.asOf.includes("24 Apr 2026"))) {
    return baseData;
  }

  const liveFeedItems = liveStocks.slice(0, 6).map(({ code, name, quote }) => ({
    code,
    name,
    price: formatYen(quote.lastPrice),
    change: signedPct(quote.changePct),
  }));
  const heatmap = heatmapStocks.map((stock) => {
    const quote = stockQuoteByCode.get(stock.code);
    return quote ? { ...stock, changePct: compactNumber(quote.changePct, 2) } : stock;
  });
  const attribution = liveStocks
    .map(({ code, name, marketCap, quote }) => ({
      code,
      name,
      contribution: compactNumber((quote.changePct * marketCap) / 5, 1),
      changePct: compactNumber(quote.changePct, 2),
    }))
    .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
    .slice(0, 5);

  return {
    ...baseData,
    dataSource: liveStocks.length || indices.some((index) => !index.asOf.includes("24 Apr 2026")) ? source : "Sample fallback",
    liveFeed: liveFeedItems.length ? liveFeedItems : baseData.liveFeed,
    attributionTop5: attribution.length ? attribution : baseData.attributionTop5,
    indices,
    sectors: createSectorData(stockQuoteByCode),
    heatmapStocks: heatmap,
  };
}

function createFallbackMarketData() {
  const marketClock = getTokyoMarketClock();

  return {
    updatedAt: marketClock.updatedAt,
    marketStatus: marketClock.marketStatus,
    dataSource: "Sample fallback",
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

export async function fetchMarketData() {
  const fallbackData = createFallbackMarketData();

  try {
    const quoteMap = await fetchLiveQuotes();
    return applyLiveQuotes(fallbackData, quoteMap);
  } catch {
    return fallbackData;
  }
}
