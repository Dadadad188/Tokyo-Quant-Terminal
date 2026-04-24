
# Tokyo Institutional Market Monitor

Tokyo Institutional Market Monitor is an institutional-grade Japanese equity analytics terminal built with React. It provides a high-density desktop dashboard and an iPhone-optimized mobile web app for monitoring Nikkei 225, TOPIX, sector attribution, valuation regimes, and market breadth.

The project is designed around a buy-side and sell-side quant workflow: fast index monitoring, valuation context, cross-asset signals, and mobile-first energy efficiency.

## Quant Logic

The core valuation signal is the Equity Risk Premium (ERP):

```text
ERP = 1 / P/E Ratio - JGB 10Y Yield
```

When ERP rises above the configured threshold, the terminal can flag a stronger equity risk compensation regime. The dashboard also tracks P/E Ratio, P/B Ratio, Dividend Yield, foreign flow, Advance-Decline Line (ADL), and return distribution.

## Tech Stack

- React
- Tailwind CSS
- Apache ECharts
- SWR for real-time synchronization
- React Router
- Lucide React
- Vite

## Key Features

- Real-time Nikkei 225 and TOPIX monitoring.
- Institutional valuation cards for P/E Ratio, P/B Ratio, Dividend Yield, foreign inflow, and Equity Risk Premium (ERP).
- Sector Attribution treemap for the TSE 33 industry groups.
- Market Breadth analytics with Return Distribution and Advance-Decline Line (ADL).
- Desktop Bento Grid for high-density analysis.
- iPhone layout with safe-area support, PWA full-screen meta tags, and low-power mode.
- Visibility API aware refresh logic to pause polling when the app is backgrounded.
- SWR-powered focus revalidation and route-specific refresh intervals.

## iPhone Adaptation

The mobile route is optimized for iOS Safari and Home Screen launch:

- `viewport-fit=cover` for Dynamic Island and notch-safe layout.
- `apple-mobile-web-app-capable=yes` for full-screen PWA behavior.
- `black-translucent` status bar style.
- Safe-area padding through CSS environment variables.
- Low Power Mode that keeps only core index panels active and suspends expensive chart rendering.

## Routes

- `/desktop` - Full institutional terminal.
- `/mobile` - iPhone-optimized terminal.
- `/` - Device-aware redirect.

## Visuals

<img width="2894" height="1640" alt="image" src="https://github.com/user-attachments/assets/aaa21ba5-3d70-42ee-9658-0f8c8ac3ebd6" />



## Getting Started

```bash
npm install
npm start
```

Open:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## License

Private project. Add a license before public distribution.
