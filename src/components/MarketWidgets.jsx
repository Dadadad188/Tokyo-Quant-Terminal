import { Clock3, RefreshCw, ShieldCheck } from "lucide-react";
import {
  ChartShell,
  CountUpNumber,
  Panel,
  ReactECharts,
  chartTextStyle,
  downColor,
  formatNumber,
  gridLine,
  signed,
  upColor,
  valueColor,
} from "./Primitives";

function marketStatusTone(status) {
  if (status === "LIVE MARKET") return { badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100", dot: "bg-[#22c55e]" };
  if (status === "MIDDAY BREAK" || status === "PRE-MARKET") return { badge: "border-amber-300/25 bg-amber-300/10 text-amber-100", dot: "bg-amber-300" };
  return { badge: "border-red-300/25 bg-red-400/10 text-red-100", dot: "bg-[#ef4444]" };
}

export function LiveFeed({ items }) {
  const tape = [...items, ...items];
  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950/80 py-1.5">
      <div className="ticker-track flex w-max gap-8 whitespace-nowrap font-mono mono-tabular text-[14px] uppercase tracking-wide">
        {tape.map((item, index) => (
          <span key={`${item.code}-${index}`} className="inline-flex items-center gap-2">
            <span className="text-slate-500">{item.code}</span>
            <span className="text-slate-200">{item.name}</span>
            <span className="text-slate-100">{item.price}</span>
            <span className={item.change.startsWith("-") ? "text-[#ef4444]" : "text-[#22c55e]"}>{item.change}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MacroCapsules({ indicators, compact = false }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {indicators.map((item) => (
        <div key={item.label} className={`${compact ? "min-w-[132px]" : "min-w-[148px]"} rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 shadow-[0_12px_36px_rgba(0,0,0,0.32)] backdrop-blur-md`}>
          <div className="text-sm uppercase tracking-wide text-slate-500">{item.label}</div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <span className="font-mono mono-tabular text-sm text-slate-100">{item.value}</span>
            <span className={`font-mono mono-tabular text-sm ${item.tone === "up" ? "text-[#22c55e]" : "text-[#ef4444]"}`}>{item.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ points, tone, id, tooltipDate = "25 Apr 2026", disabled = false }) {
  if (disabled) {
    return <div className="h-14 w-full min-w-[112px] rounded-xl border border-white/10 bg-slate-950/40" aria-hidden="true" />;
  }

  const color = tone === "up" ? upColor : downColor;
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:30"];
  const option = {
    animation: false,
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      confine: true,
      backgroundColor: "rgba(2, 6, 23, 0.95)",
      borderColor: "rgba(255, 255, 255, 0.12)",
      textStyle: chartTextStyle(14),
      axisPointer: { type: "cross", lineStyle: { color: "rgba(226,232,240,.56)", type: "dashed" }, label: { show: false } },
      formatter(params) {
        const point = params[0];
        return `${tooltipDate}, ${point.axisValue} JST<br/>${id}: ${formatNumber(point.value, 2)}`;
      },
    },
    grid: { left: 0, right: 0, top: 6, bottom: 0 },
    xAxis: { type: "category", boundaryGap: false, data: times.slice(0, points.length), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false } },
    yAxis: { type: "value", scale: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
    series: [{
      type: "line",
      data: points,
      smooth: true,
      showSymbol: false,
      lineStyle: { color, width: 2.2 },
      areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: `${color}66` }, { offset: 1, color: `${color}05` }] } },
    }],
  };

  return (
    <div className="h-14 w-full min-w-[112px]" role="img" aria-label={`${id} intraday sparkline`}>
      <ChartShell className="h-14">
        <ReactECharts option={option} autoResize={true} style={{ height: "100%", width: "100%" }} />
      </ChartShell>
    </div>
  );
}

export function HeaderBlock({ marketData, onRefresh, compact = false, lowPower = false }) {
  const statusTone = marketStatusTone(marketData.marketStatus);
  return (
    <Panel className="p-4">
      {!compact && !lowPower ? <LiveFeed items={marketData.liveFeed ?? []} /> : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm uppercase text-emerald-200/80">
            <ShieldCheck size={16} />
            Tokyo Institutional Market Terminal
          </div>
          <h1 className="mt-2 text-xl font-semibold leading-tight text-slate-50">Tokyo Institutional Market Terminal</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${statusTone.badge}`}>
              <span className={`h-2 w-2 rounded-full ${statusTone.dot}`} />
              {marketData.marketStatus}
            </span>
            <span className="inline-flex items-center gap-2 font-mono mono-tabular text-slate-400">
              <Clock3 size={15} />
              {marketData.updatedAt}
            </span>
          </div>
        </div>
        <button type="button" onClick={onRefresh} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-300/20 bg-slate-950/30 text-emerald-100 transition active:scale-95 active:bg-emerald-400/10" aria-label="Refresh market data">
          <RefreshCw size={17} />
        </button>
      </div>
      {!lowPower ? <div className="mt-4">
        <MacroCapsules indicators={marketData.macroIndicators ?? []} compact={compact} />
      </div> : null}
    </Panel>
  );
}

export function IndexCards({ indices, quant, compact = false, lowPower = false, animationEnabled = true }) {
  return (
    <div className={compact ? "flex flex-col gap-3" : "grid grid-cols-1 gap-3 lg:grid-cols-2"}>
      {indices.map((index) => (
        <Panel key={index.symbol} className="p-4">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>{index.name}</span>
            <span className="font-mono mono-tabular text-sm text-slate-500">{index.symbol}</span>
          </div>
          <div className="mt-2 font-mono mono-tabular text-sm uppercase text-slate-500">{index.asOf}</div>
          <div className={lowPower ? "mt-3" : "mt-3 grid grid-cols-[minmax(0,1fr)_minmax(104px,42%)] items-center gap-3"}>
            <CountUpNumber value={index.value} animate={animationEnabled && !lowPower} debounceMs={compact ? 360 : 180} className="font-mono mono-tabular text-3xl font-semibold text-slate-50" />
            {!lowPower ? <Sparkline points={index.intraday ?? [index.value, index.value]} tone={index.changePct >= 0 ? "up" : "down"} id={index.symbol} tooltipDate={index.tooltipDate} /> : null}
          </div>
          <div className={`mt-2 flex items-center gap-2 font-mono mono-tabular text-sm ${valueColor(index.changePct)}`}>
            <span>{signed(index.change)} / {signed(index.changePct)}%</span>
          </div>
          {index.realtimePe ? (
            <div className="mt-3 border-t border-white/10 pt-2 text-sm text-slate-400">
              Real-time P/E Ratio: <span className="font-mono mono-tabular text-emerald-100">{index.realtimePe.value}</span>{" "}
              <span>({signed(quant.peZScore, 1)}σ)</span>
            </div>
          ) : null}
        </Panel>
      ))}
    </div>
  );
}

export function ERPCard({ quant, className = "", animationEnabled = true }) {
  const isStrongBuy = quant.erpSignal === "Strong Buy Signal";
  return (
    <Panel className={`p-4 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-wide text-emerald-200/80">Core Quant Model</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">Equity Risk Premium</h2>
        </div>
        <span className={`rounded-full border px-3 py-1 text-sm ${isStrongBuy ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200" : "border-amber-300/30 bg-amber-400/10 text-amber-100"}`}>{quant.erpSignal}</span>
      </div>
      <div className="mt-5 font-mono mono-tabular text-4xl font-semibold text-slate-50">
        <CountUpNumber value={quant.erp} digits={2} animate={animationEnabled} />%
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-400">
        <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2">
          <div>1 / P/E</div>
          <div className="mt-1 font-mono mono-tabular text-slate-100">{formatNumber(quant.earningsYield, 2)}%</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2">
          <div>JGB 10Y</div>
          <div className="mt-1 font-mono mono-tabular text-slate-100">{formatNumber(quant.jgb10y, 2)}%</div>
        </div>
      </div>
    </Panel>
  );
}

export { ChartShell, Panel, ReactECharts, chartTextStyle, downColor, formatNumber, gridLine, signed, upColor, valueColor };
