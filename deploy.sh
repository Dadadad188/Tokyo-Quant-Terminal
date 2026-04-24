#!/usr/bin/env bash
set -Eeuo pipefail

RELEASE_MESSAGE="feat: institutional-grade terminal v3.0 release"
REPO_URL="${1:-${GITHUB_REPO_URL:-YOUR_GITHUB_REPOSITORY_URL_HERE}}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$PROJECT_ROOT"

log() {
  printf "\033[1;32m[deploy]\033[0m %s\n" "$1"
}

fail() {
  printf "\033[1;31m[deploy:error]\033[0m %s\n" "$1" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

require_command git
require_command node
require_command npm
require_command perl

if [[ "$REPO_URL" == "YOUR_GITHUB_REPOSITORY_URL_HERE" ]]; then
  fail "Please pass your GitHub repository URL: ./deploy.sh git@github.com:USER/REPO.git"
fi

log "Step 1/6: applying institutional English terminology refinements"

TEXT_FILES=()
while IFS= read -r -d "" file; do
  TEXT_FILES+=("$file")
done < <(find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.css" \) -print0)
TEXT_FILES+=("index.html" "README.md" "package.json")

for file in "${TEXT_FILES[@]}"; do
  [[ -f "$file" ]] || continue
  perl -0pi -e '
    s/日股市场深度分析看板/Tokyo Institutional Market Terminal/g;
    s/777神秘看板/Tokyo Institutional Market Terminal/g;
    s/已收盘/MARKET CLOSED/g;
    s/交易中/LIVE MARKET/g;
    s/休市/MARKET HOLIDAY/g;
    s/未开盘/PRE-MARKET/g;
    s/午间休市/MIDDAY BREAK/g;
    s/市盈率/P\/E Ratio/g;
    s/市净率/P\/B Ratio/g;
    s/股息率/Dividend Yield/g;
    s/股权风险溢价/Equity Risk Premium (ERP)/g;
    s/市场宽度/Market Breadth/g;
    s/涨跌分布/Return Distribution/g;
    s/ADL 线/Advance-Decline Line (ADL)/g;
    s/行业贡献度/Sector Attribution/g;
    s/较 5 年均值/vs. 5Y Historical Mean/g;
    s/分位数/Percentile/g;
    s/标准差/Std Dev (sigma)/g;
    s/权重归因/Factor Attribution/g;
    s/指数贡献/Index Contribution/g;
    s/核心估值/Core Valuation/g;
    s/低功耗模式/Low Power Mode/g;
    s/刷新数据/Refresh market data/g;
    s/涨跌幅/Return/g;
    s/成交量热度/Volume Heat/g;
    s/估值分位/Valuation Percentile/g;
    s/估值分位数/Valuation Percentile/g;
    s/价值股 vs 成长股/Value vs Growth Relative Strength/g;
  ' "$file"
done

log "Step 2/6: enforcing tabular number typography"

if [[ -f "src/index.css" ]] && ! grep -q "font-variant-numeric: tabular-nums" src/index.css; then
  cat >> src/index.css <<'CSS'

body {
  font-variant-numeric: tabular-nums;
}

.mono-tabular {
  font-variant-numeric: tabular-nums;
}
CSS
fi

log "Step 3/6: inserting iPhone/PWA meta tags"

node <<'NODE'
const fs = require("fs");
const path = "index.html";
let html = fs.readFileSync(path, "utf8");

html = html.replace(/<html\s+lang="[^"]*"/, '<html lang="en"');

function upsertMetaByName(name, content) {
  const tag = `<meta name="${name}" content="${content}" />`;
  const pattern = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*/?>`, "i");
  if (pattern.test(html)) html = html.replace(pattern, tag);
  else html = html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertViewport(content) {
  const tag = `<meta name="viewport" content="${content}" />`;
  const pattern = /<meta\s+name="viewport"\s+content="[^"]*"\s*\/?>/i;
  if (pattern.test(html)) html = html.replace(pattern, tag);
  else html = html.replace("</head>", `    ${tag}\n  </head>`);
}

upsertViewport("width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover");
upsertMetaByName("apple-mobile-web-app-capable", "yes");
upsertMetaByName("apple-mobile-web-app-status-bar-style", "black-translucent");
upsertMetaByName("apple-mobile-web-app-title", "Tokyo Terminal");
upsertMetaByName("mobile-web-app-capable", "yes");
upsertMetaByName("theme-color", "#020617");
upsertMetaByName("format-detection", "telephone=no");

html = html.replace(/<title>.*?<\/title>/i, "<title>Tokyo Institutional Market Terminal</title>");

fs.writeFileSync(path, html);
NODE

log "Step 4/6: generating GitHub-ready config files"

cat > .gitignore <<'EOF'
# Dependencies
node_modules/

# Build outputs
dist/
build/
.vite/

# Environment files
.env
.env.*
!.env.example

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
*.log

# OS and editor files
.DS_Store
Thumbs.db
Desktop.ini
.idea/
.vscode/
*.swp
*.swo

# Runtime caches
.cache/
.parcel-cache/
coverage/

# Local generated captures
screenshot-segments/
777-dashboard-complete.png
EOF

cat > README.md <<'EOF'
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

Place a product screenshot here:

![Tokyo Institutional Market Monitor screenshot](./docs/screenshot.png)

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
EOF

log "Step 5/6: validating English UI and production build"

if grep -RInP "[\x{4E00}-\x{9FFF}]" src index.html README.md package.json >/tmp/tokyo-terminal-cjk-scan.txt 2>/dev/null; then
  cat /tmp/tokyo-terminal-cjk-scan.txt >&2
  fail "Chinese/CJK characters remain. Please review the matches above before deploying."
fi

npm run build

log "Step 6/6: committing and force-pushing to GitHub"

if [[ ! -d ".git" ]]; then
  git init
fi

git add .

if git diff --cached --quiet; then
  log "No staged changes detected; creating an empty release commit"
  git commit --allow-empty -m "$RELEASE_MESSAGE"
else
  git commit -m "$RELEASE_MESSAGE"
fi

git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git push -u origin main --force

log "Deployment complete: pushed main to $REPO_URL"
