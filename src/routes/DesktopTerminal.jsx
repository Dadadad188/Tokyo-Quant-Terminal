import { Activity, Banknote, BarChart3, Globe2, Layers3, Sigma, TrendingUp } from "lucide-react";
import { useState } from "react";
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
  downColor,
  formatNumber,
  gridLine,
  signed,
  upColor,
  valueColor,
} from "../components/MarketWidgets";

function Loading() {
  return (
    <main className="terminal-shell flex min-h-screen items-center justify-center p-6 text-slate-100">
      <div className="glass-panel rounded-xl px-6 py-5 font-mono mono-tabular text-sm">LOADING TOKYO MARKET DEPTH...</div>
    </main>
  );
}

function MetricCard({ metric, icon: Icon }) {
  const positive = metric.delta >= 0;
  return (
    <div className="metric-panel rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Icon size={17} className="text-emerald-200" />
          <span>{metric.label}</span>
        </div>
        <span className={`font-mono mono-tabular text-sm ${positive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{signed(metric.delta)}</span>
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="font-mono mono-tabular text-4xl font-semibold text-slate-50">{metric.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}</span>
        <span className="mb-1 font-mono mono-tabular text-sm text-slate-400">{metric.suffix}</span>
      </div>
      <div className="mt-4 text-sm text-emerald-100">{metric.context}</div>
      <div className="mt-1 text-sm text-slate-400">{metric.detail}</div>
    </div>
  );
}

function ValuationMetrics({ metrics }) {
  const icons = [Sigma, Layers3, Banknote, Globe2];
  return (
    <div className="col-span-12 grid grid-cols-4 gap-3">
      {metrics.map((metric, index) => <MetricCard key={metric.key} metric={metric} icon={icons[index]} />)}
    </div>
  );
}

function AttributionPanel({ items }) {
  const maxAbs = Math.max(1, ...items.map((item) => Math.abs(item.contribution)));
  return (
    <Panel className="col-span-5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-wide text-emerald-200/80">Attribution Top 5</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">Nikkei 225 Factor Attribution</h2>
        </div>
        <span className="rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1 font-mono mono-tabular text-sm text-slate-400">points</span>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const positive = item.contribution >= 0;
          const width = (Math.abs(item.contribution) / maxAbs) * 100;
          return (
            <div key={item.code}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <span className="font-mono mono-tabular text-emerald-100">{item.code}</span>
                  <span className="ml-2 truncate text-slate-300">{item.name}</span>
                </div>
                <span className={`font-mono mono-tabular ${positive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{signed(item.contribution, 1)}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950/80">
                <div className={`h-2 rounded-full ${positive ? "bg-[#22c55e]" : "bg-[#ef4444]"}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function CorrelationPanel({ data }) {
  const pct = ((data.value + 1) / 2) * 100;
  return (
    <Panel className="col-span-3 p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Correlation Monitor</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">{data.pair}</h2>
      <div className="mt-5 font-mono mono-tabular text-4xl font-semibold text-slate-50">{formatNumber(data.value, 2)}</div>
      <div className="mt-2 flex justify-between text-sm text-slate-500">
        <span>{data.window} rolling</span>
        <span className={data.delta >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}>{signed(data.delta, 2)}</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-950/80">
        <div className="h-2 rounded-full bg-sky-400" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-3 text-sm text-slate-400">{data.reading}</div>
    </Panel>
  );
}

function StyleFlowPanel({ data }) {
  return (
    <Panel className="col-span-4 p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Factor Flow</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Value vs Growth Relative Strength</h2>
      <div className="mt-5 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950/80">
        <div className="flex h-full">
          <div className="h-full bg-cyan-400" style={{ width: `${data.valueScore}%` }} />
          <div className="h-full bg-violet-400" style={{ width: `${data.growthScore}%` }} />
        </div>
      </div>
      <div className="mt-2 flex justify-between font-mono mono-tabular text-sm text-slate-400">
        <span>Value {data.valueScore}</span>
        <span>Growth {data.growthScore}</span>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-violet-100">{data.label}</div>
    </Panel>
  );
}

function VolatilityTermPanel({ curve }) {
  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: "rgba(2,6,23,.95)", borderColor: "rgba(255,255,255,.12)", textStyle: chartTextStyle(14), axisPointer: { type: "cross", label: { show: false } } },
    grid: { top: 12, right: 12, bottom: 24, left: 36 },
    xAxis: { type: "category", data: curve.map((p) => p.tenor), axisLabel: chartTextStyle(14), axisLine: { lineStyle: { color: gridLine } }, axisTick: { show: false } },
    yAxis: { type: "value", scale: true, axisLabel: { ...chartTextStyle(14), formatter: "{value}%" }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{ name: "Implied Vol", type: "line", data: curve.map((p) => p.vol), smooth: true, symbol: "circle", symbolSize: 5, lineStyle: { color: "#f59e0b", width: 2.3 }, areaStyle: { color: "rgba(245,158,11,.12)" } }],
  };
  return (
    <Panel className="col-span-4 p-4">
      <div className="text-sm uppercase tracking-wide text-emerald-200/80">Vol Term Structure</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Nikkei VI vs Forward IV</h2>
      <div className="mt-3 h-44">
        <ChartShell className="h-44">
          <ReactECharts option={option} autoResize={true} style={{ height: "100%", width: "100%" }} />
        </ChartShell>
      </div>
    </Panel>
  );
}

function GovernanceMonitor({ data }) {
  return (
    <Panel className="col-span-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-wide text-emerald-200/80">Governance Monitor</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">P/B 1.0 Governance Watch</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-100">Buybacks {data.buybackToday}</div>
      </div>
      <div className="mt-5 h-4 overflow-hidden rounded-full border border-white/10 bg-slate-950/80">
        <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" style={{ width: `${data.pbCleanupProgress}%` }} />
      </div>
      <div className="mt-2 flex justify-between font-mono mono-tabular text-sm text-slate-400">
        <span>Cleanup {formatNumber(data.pbCleanupProgress, 2)}%</span>
        <span>Below book {formatNumber(data.remainingBelowBook, 2)}%</span>
      </div>
    </Panel>
  );
}

function SectorDeepDive({ sectors, selectedSector, onSelectSector }) {
  const sorted = [...sectors].sort((a, b) => b.volumeHeat - a.volumeHeat);
  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
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
      breadcrumb: { show: false },
      label: { show: true, color: "#f8fafc", formatter: (info) => `${info.data.name}\n${signed(info.data.changePct)}%`, fontSize: 16, lineHeight: 21, overflow: "break", fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif", fontWeight: 650 },
      itemStyle: { borderColor: "rgba(2,6,23,.96)", borderWidth: 2, gapWidth: 2 },
      data: sorted.map((item) => {
        const intensity = Math.min(0.96, 0.28 + Math.abs(item.changePct) / 3.2);
        return { ...item, name: item.name, value: item.volumeHeat, itemStyle: { color: item.changePct >= 0 ? `rgba(34,197,94,${intensity})` : `rgba(239,68,68,${intensity})` } };
      }),
    }],
  };
  const selected = sectors.find((sector) => sector.name === selectedSector) ?? sectors[0];
  return (
    <Panel className="col-span-8 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-emerald-200"><BarChart3 size={17} />Sector Deep Dive</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">TSE 33 Sector Attribution Treemap</h2>
        </div>
        <div className="rounded-lg border border-emerald-300/15 bg-slate-950/25 px-3 py-2 text-sm text-slate-400">Size = volume heat, color = return</div>
      </div>
      <div className="h-[520px]">
        <ChartShell className="h-[520px]">
          <ReactECharts option={option} onEvents={{ click: (params) => params.data?.name && onSelectSector(params.data.name) }} autoResize={true} style={{ height: "100%", width: "100%" }} />
        </ChartShell>
      </div>
      <div className="mt-4 rounded-xl border border-emerald-300/15 bg-slate-950/25 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-300">Sector Constituents</div>
            <div className="font-mono mono-tabular text-lg text-slate-50">{selected.name}</div>
          </div>
          <div className={`font-mono mono-tabular text-sm ${valueColor(selected.changePct)}`}>{signed(selected.changePct)}%</div>
        </div>
        <table className="w-full text-left text-sm">
          <tbody>{selected.stocks.map((stock) => (
            <tr key={stock.code} className="border-t border-slate-700/40">
              <td className="py-2 font-mono mono-tabular text-emerald-100">{stock.code}</td>
              <td className="py-2 text-slate-300">{stock.name}</td>
              <td className={`py-2 text-right font-mono mono-tabular ${valueColor(stock.changePct)}`}>{signed(stock.changePct)}%</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </Panel>
  );
}

function BreadthPanel({ histogram, adLine }) {
  const histogramOption = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: "rgba(15,23,42,.94)", textStyle: chartTextStyle(14) },
    grid: { top: 18, left: 42, right: 16, bottom: 32 },
    xAxis: { type: "category", data: histogram.map((i) => i.bin), axisLabel: chartTextStyle(14), axisLine: { lineStyle: { color: gridLine } } },
    yAxis: { type: "value", axisLabel: chartTextStyle(14), splitLine: { lineStyle: { color: gridLine } } },
    series: [{ type: "bar", barWidth: "70%", data: histogram.map((i) => ({ value: i.count, itemStyle: { color: i.tone === "up" ? "rgba(34,197,94,.86)" : "rgba(239,68,68,.86)" } })) }],
  };
  const adlOption = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: "rgba(15,23,42,.94)", textStyle: chartTextStyle(14), axisPointer: { type: "cross" } },
    grid: { top: 18, left: 42, right: 16, bottom: 30 },
    xAxis: { type: "category", boundaryGap: false, data: adLine.map((i) => i.time), axisLabel: chartTextStyle(14), axisLine: { lineStyle: { color: gridLine } } },
    yAxis: { type: "value", axisLabel: chartTextStyle(14), splitLine: { lineStyle: { color: gridLine } } },
    series: [{ name: "ADL", type: "line", smooth: true, symbol: "circle", symbolSize: 5, lineStyle: { color: upColor, width: 3 }, areaStyle: { color: "rgba(34,197,94,.16)" }, data: adLine.map((i) => i.value) }],
  };
  return (
    <Panel className="col-span-4 p-4">
      <div className="flex items-center gap-2 text-sm text-emerald-200"><Activity size={17} />Market Breadth</div>
      <h2 className="mt-1 text-lg font-semibold text-slate-50">Return Distribution & Advance-Decline Line (ADL)</h2>
      <div className="mt-4 h-64"><ChartShell className="h-64"><ReactECharts option={histogramOption} autoResize={true} style={{ height: "100%", width: "100%" }} /></ChartShell></div>
      <div className="mt-4 h-64"><ChartShell className="h-64"><ReactECharts option={adlOption} autoResize={true} style={{ height: "100%", width: "100%" }} /></ChartShell></div>
    </Panel>
  );
}

export default function DesktopTerminal() {
  const { marketData, loading, reload, isVisible } = useMarketData({ refreshInterval: 5_000 });
  const [selectedSector, setSelectedSector] = useState("Transport Equipment");
  const quant = useQuantModels(marketData);

  if (loading && !marketData) return <Loading />;

  return (
    <main className="desktop-shell terminal-shell min-h-screen p-5 text-slate-100" data-paused={!isVisible}>
      <div className="mx-auto grid max-w-[1760px] grid-cols-12 gap-3">
        <div className="col-span-12">
          <HeaderBlock marketData={marketData} onRefresh={reload} />
        </div>
        <div className="col-span-12">
          <IndexCards indices={marketData.indices} quant={quant} animationEnabled={isVisible} />
        </div>
        <ERPCard quant={quant} className="col-span-4" animationEnabled={isVisible} />
        <VolatilityTermPanel curve={marketData.volatilityTermStructure ?? []} />
        <GovernanceMonitor data={marketData.governanceMonitor} />
        <AttributionPanel items={marketData.attributionTop5 ?? []} />
        <CorrelationPanel data={marketData.correlationMonitor} />
        <StyleFlowPanel data={marketData.styleFlow} />
        <ValuationMetrics metrics={marketData.metrics} />
        <SectorDeepDive sectors={marketData.sectors} selectedSector={selectedSector} onSelectSector={setSelectedSector} />
        <BreadthPanel histogram={marketData.breadthHistogram} adLine={marketData.adLine} />
      </div>
    </main>
  );
}
