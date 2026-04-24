import { Activity, Banknote, BarChart3, Globe2, Layers3, Sigma } from "lucide-react";
import { useEffect, useState } from "react";
import { useMarketData } from "../hooks/useMarketData";
import { useQuantModels } from "../hooks/useQuantModels";
import {
  ChartShell,
  ERPCard,
  HeaderBlock,
  IndexCards,
  Panel,
  ReactECharts,
  chartTextStyle,
  formatNumber,
  gridLine,
  signed,
  upColor,
  valueColor,
} from "../components/MarketWidgets";

function Loading() {
  return (
    <main className="terminal-shell ios-app flex min-h-screen items-center justify-center text-slate-100">
      <div className="glass-panel rounded-xl px-6 py-5 font-mono mono-tabular text-sm">LOADING TOKYO MARKET DEPTH...</div>
    </main>
  );
}

function getInitialLowPower() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("tokyo-terminal-low-power") === "true";
}

function LowPowerToggle({ checked, onChange, polling }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-wide text-emerald-200/80">Power Profile</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">Low Power Mode</h2>
          <p className="mt-1 text-sm text-slate-400">{checked ? "Core indices only. Polling, charts and animations are suspended." : `Mobile ${polling ? "15s polling" : "background pause"} with focus revalidation.`}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-label="Low Power Mode"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`relative h-8 w-14 shrink-0 rounded-full border transition active:scale-95 ${checked ? "border-emerald-300/30 bg-emerald-400/30" : "border-white/10 bg-slate-950/70"}`}
        >
          <span className={`absolute top-1 h-6 w-6 rounded-full bg-slate-100 transition ${checked ? "left-7" : "left-1"}`} />
        </button>
      </div>
    </Panel>
  );
}

function MobileMetricGrid({ metrics }) {
  const icons = [Sigma, Layers3, Banknote, Globe2];
  return (
    <Panel className="p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Valuation Metrics</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Core Valuation</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => {
          const Icon = icons[index] ?? Sigma;
          return (
            <div key={metric.key} className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Icon size={15} className="text-emerald-200" />
                <span>{metric.label}</span>
              </div>
              <div className="mt-3 font-mono mono-tabular text-2xl font-semibold text-slate-50">
                {formatNumber(metric.value, metric.value >= 10 ? 1 : 2)}
                <span className="ml-1 text-sm text-slate-500">{metric.suffix}</span>
              </div>
              <div className={`mt-1 font-mono mono-tabular text-sm ${valueColor(metric.delta)}`}>{signed(metric.delta)}</div>
              <div className="mt-2 text-sm text-slate-400">{metric.context}</div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function MobileAttribution({ items }) {
  return (
    <Panel className="p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Attribution Top 5</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Index Contribution</h2>
      <div className="mt-3 space-y-3">
        {items.slice(0, 5).map((item) => (
          <div key={item.code} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm">
            <div className="min-w-0">
              <div className="font-mono mono-tabular text-emerald-100">{item.code}</div>
              <div className="truncate text-slate-400">{item.name}</div>
            </div>
            <div className={item.contribution >= 0 ? "font-mono mono-tabular text-[#22c55e]" : "font-mono mono-tabular text-[#ef4444]"}>
              {signed(item.contribution, 1)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MobileGovernance({ data }) {
  return (
    <Panel className="p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Governance Monitor</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">P/B 1.0 Governance Watch</h2>
      <div className="mt-4 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950/80">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${data.pbCleanupProgress}%` }} />
      </div>
      <div className="mt-2 flex justify-between font-mono mono-tabular text-sm text-slate-400">
        <span>Cleanup {formatNumber(data.pbCleanupProgress, 2)}%</span>
        <span>Below book {formatNumber(data.remainingBelowBook, 2)}%</span>
      </div>
      <div className="mt-3 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-100">
        Announced buybacks {data.buybackToday} / {data.buybackCount} deals
      </div>
    </Panel>
  );
}

function MobileCorrelation({ data }) {
  const pct = ((data.value + 1) / 2) * 100;
  return (
    <Panel className="p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Correlation Monitor</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">{data.pair}</h2>
      <div className="mt-4 flex items-end justify-between">
        <span className="font-mono mono-tabular text-4xl font-semibold text-slate-50">{formatNumber(data.value, 2)}</span>
        <span className={data.delta >= 0 ? "font-mono mono-tabular text-[#22c55e]" : "font-mono mono-tabular text-[#ef4444]"}>{signed(data.delta, 2)}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-slate-950/80">
        <div className="h-2 rounded-full bg-sky-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 text-sm text-slate-400">{data.window} rolling / {data.reading}</div>
    </Panel>
  );
}

function MobileStyleFlow({ data }) {
  return (
    <Panel className="p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Factor Flow</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Value vs Growth Relative Strength</h2>
      <div className="mt-4 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950/80">
        <div className="flex h-full">
          <div className="h-full bg-cyan-400" style={{ width: `${data.valueScore}%` }} />
          <div className="h-full bg-violet-400" style={{ width: `${data.growthScore}%` }} />
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono mono-tabular text-sm text-slate-400">
        <span>Value {data.valueScore}</span>
        <span>Growth {data.growthScore}</span>
      </div>
      <div className="mt-3 text-sm text-violet-100">{data.label}</div>
    </Panel>
  );
}

function MobileVolatility({ vi, curve }) {
  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", confine: true, backgroundColor: "rgba(2,6,23,.95)", borderColor: "rgba(255,255,255,.12)", textStyle: chartTextStyle(14), axisPointer: { type: "cross", label: { show: false } } },
    grid: { top: 16, right: 10, bottom: 24, left: 34 },
    xAxis: { type: "category", data: curve.map((p) => p.tenor), axisLabel: chartTextStyle(14), axisLine: { lineStyle: { color: gridLine } }, axisTick: { show: false } },
    yAxis: { type: "value", scale: true, axisLabel: { ...chartTextStyle(14), formatter: "{value}%" }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{ name: "Implied Vol", type: "line", data: curve.map((p) => p.vol), smooth: true, symbol: "circle", symbolSize: 5, lineStyle: { color: "#f59e0b", width: 2.2 }, areaStyle: { color: "rgba(245,158,11,.12)" } }],
  };
  return (
    <Panel className="p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Volatility</div>
      <div className="mt-1 flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-50">Nikkei VI</h2>
        <span className="font-mono mono-tabular text-2xl font-semibold text-slate-50">{formatNumber(vi.value, 1)}</span>
      </div>
      <div className="mt-1 text-sm text-slate-400">{vi.regime}</div>
      <div className="mt-4 h-44">
        <ChartShell className="h-44">
          <ReactECharts option={option} autoResize={true} style={{ height: "100%", width: "100%" }} />
        </ChartShell>
      </div>
    </Panel>
  );
}

function MobileSectorTreemap({ sectors }) {
  const [selectedSector, setSelectedSector] = useState(sectors[0]?.name ?? "");
  const sorted = [...sectors].sort((a, b) => b.volumeHeat - a.volumeHeat);
  const selected = sectors.find((sector) => sector.name === selectedSector) ?? sectors[0];
  const mobileReadableMinValue = 54;
  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "rgba(15,23,42,.94)",
      borderColor: "rgba(52,211,153,.26)",
      textStyle: chartTextStyle(14),
      formatter(params) {
        const sector = params.data;
        return [`<b>${sector.name}</b>`, `Return: ${signed(sector.changePct)}%`, `Valuation Percentile: ${sector.valuationPercentile}%`, `Volume Heat: ${sector.volumeHeat}`].join("<br/>");
      },
    },
    series: [{
      type: "treemap",
      roam: false,
      nodeClick: false,
      visibleMin: 0,
      childrenVisibleMin: 0,
      squareRatio: 0.95,
      breadcrumb: { show: false },
      label: {
        show: true,
        position: "insideTopLeft",
        color: "#f8fafc",
        formatter: (info) => `{name|${info.data.name}}`,
        minMargin: 1,
        padding: [4, 4, 4, 4],
        overflow: "breakAll",
        rich: {
          name: { fontSize: 11, lineHeight: 14, fontWeight: 700, color: "#f8fafc", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" },
        },
      },
      itemStyle: { borderColor: "rgba(2,6,23,.96)", borderWidth: 1.5, gapWidth: 1.5 },
      data: sorted.map((item) => {
        const intensity = Math.min(0.96, 0.28 + Math.abs(item.changePct) / 3.2);
        return { ...item, value: Math.max(item.volumeHeat, mobileReadableMinValue), itemStyle: { color: item.changePct >= 0 ? `rgba(34,197,94,${intensity})` : `rgba(239,68,68,${intensity})` } };
      }),
    }],
  };

  return (
    <Panel className="p-4">
      <div className="flex items-center gap-2 text-sm text-emerald-200">
        <BarChart3 size={16} />
        <span>Sector Attribution</span>
      </div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">TSE 33 Sector Treemap</h2>
      <div className="mt-4 h-[560px]">
        <ChartShell className="h-[560px]">
          <ReactECharts option={option} onEvents={{ click: (params) => params.data?.name && setSelectedSector(params.data.name) }} autoResize={true} style={{ height: "100%", width: "100%" }} />
        </ChartShell>
      </div>
      {selected ? (
        <div className="mt-4 rounded-xl border border-emerald-300/15 bg-slate-950/35 p-3">
          <div className="flex items-center justify-between">
            <span className="min-w-0 break-words text-sm font-semibold text-slate-50">{selected.name}</span>
            <span className={`font-mono mono-tabular text-sm ${valueColor(selected.changePct)}`}>{signed(selected.changePct)}%</span>
          </div>
          <div className="mt-3 space-y-2">
            {selected.stocks.slice(0, 4).map((stock) => (
              <div key={stock.code} className="flex justify-between gap-3 text-sm">
                <span className="font-mono mono-tabular text-emerald-100">{stock.code}</span>
                <span className="truncate text-slate-400">{stock.name}</span>
                <span className={`font-mono mono-tabular ${valueColor(stock.changePct)}`}>{signed(stock.changePct)}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function MobileBreadth({ summary, histogram, adLine }) {
  const total = summary.advancing + summary.declining + summary.unchanged;
  const advancingPct = (summary.advancing / total) * 100;
  const decliningPct = (summary.declining / total) * 100;
  const histogramOption = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", confine: true, backgroundColor: "rgba(15,23,42,.94)", textStyle: chartTextStyle(14) },
    grid: { top: 16, left: 34, right: 8, bottom: 28 },
    xAxis: { type: "category", data: histogram.map((i) => i.bin), axisLabel: { ...chartTextStyle(14), interval: 1 }, axisLine: { lineStyle: { color: gridLine } }, axisTick: { show: false } },
    yAxis: { type: "value", axisLabel: chartTextStyle(14), splitLine: { lineStyle: { color: gridLine } } },
    series: [{ type: "bar", barWidth: "72%", data: histogram.map((i) => ({ value: i.count, itemStyle: { color: i.tone === "up" ? "rgba(34,197,94,.86)" : "rgba(239,68,68,.86)" } })) }],
  };
  const adlOption = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", confine: true, backgroundColor: "rgba(15,23,42,.94)", textStyle: chartTextStyle(14), axisPointer: { type: "cross", label: { show: false } } },
    grid: { top: 16, left: 34, right: 8, bottom: 28 },
    xAxis: { type: "category", boundaryGap: false, data: adLine.map((i) => i.time), axisLabel: { ...chartTextStyle(14), interval: 2 }, axisLine: { lineStyle: { color: gridLine } }, axisTick: { show: false } },
    yAxis: { type: "value", axisLabel: chartTextStyle(14), splitLine: { lineStyle: { color: gridLine } } },
    series: [{ name: "ADL", type: "line", smooth: true, showSymbol: false, lineStyle: { color: upColor, width: 2.5 }, areaStyle: { color: "rgba(34,197,94,.15)" }, data: adLine.map((i) => i.value) }],
  };

  return (
    <Panel className="p-4">
      <div className="flex items-center gap-2 text-sm text-emerald-200">
        <Activity size={16} />
        <span>Market Breadth</span>
      </div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Market Breadth</h2>
      <div className="mt-4 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950/70">
        <div className="flex h-full w-full">
          <div className="h-full bg-[#22c55e]" style={{ width: `${advancingPct}%` }} />
          <div className="h-full bg-[#ef4444]" style={{ width: `${decliningPct}%` }} />
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono mono-tabular text-sm text-slate-400">
        <span>{formatNumber(advancingPct, 2)}% Advancers</span>
        <span>{formatNumber(decliningPct, 2)}% Decliners</span>
      </div>
      <div className="mt-4 h-44">
        <ChartShell className="h-44">
          <ReactECharts option={histogramOption} autoResize={true} style={{ height: "100%", width: "100%" }} />
        </ChartShell>
      </div>
      <div className="mt-4 h-44">
        <ChartShell className="h-44">
          <ReactECharts option={adlOption} autoResize={true} style={{ height: "100%", width: "100%" }} />
        </ChartShell>
      </div>
    </Panel>
  );
}

export default function MobileTerminal() {
  const [lowPower, setLowPower] = useState(getInitialLowPower);
  const { marketData, loading, reload, isVisible, polling } = useMarketData({ refreshInterval: 15_000, enabled: !lowPower });
  const quant = useQuantModels(marketData);

  useEffect(() => {
    window.localStorage.setItem("tokyo-terminal-low-power", String(lowPower));
  }, [lowPower]);

  if (loading && !marketData) return <Loading />;

  return (
    <main className="terminal-shell ios-app min-h-screen text-slate-100" data-paused={!isVisible || lowPower}>
      <div className="ios-content">
        <div className="ios-stack">
          <HeaderBlock marketData={marketData} onRefresh={reload} compact lowPower={lowPower} />
          <LowPowerToggle checked={lowPower} onChange={setLowPower} polling={polling} />
          <IndexCards indices={marketData.indices} quant={quant} compact lowPower={lowPower} animationEnabled={isVisible && !lowPower} />
          {!lowPower ? (
            <>
              <ERPCard quant={quant} animationEnabled={isVisible} />
              <MobileGovernance data={marketData.governanceMonitor} />
              <MobileVolatility vi={marketData.nikkeiVi} curve={marketData.volatilityTermStructure ?? []} />
              <MobileCorrelation data={marketData.correlationMonitor} />
              <MobileStyleFlow data={marketData.styleFlow} />
              <MobileAttribution items={marketData.attributionTop5 ?? []} />
              <MobileMetricGrid metrics={marketData.metrics} />
              <MobileSectorTreemap sectors={marketData.sectors ?? []} />
              <MobileBreadth summary={marketData.breadthSummary} histogram={marketData.breadthHistogram} adLine={marketData.adLine} />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
