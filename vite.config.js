import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getMarketData } from "./api/market-data.js";

function marketDataApi() {
  return {
    name: "market-data-api",
    configureServer(server) {
      server.middlewares.use("/api/market-data", async (_request, response) => {
        try {
          const payload = await getMarketData();
          response.setHeader("Content-Type", "application/json");
          response.setHeader("Cache-Control", "no-store");
          response.end(JSON.stringify(payload));
        } catch {
          response.statusCode = 502;
          response.end(JSON.stringify({ error: "Unable to fetch market data" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), marketDataApi()],
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
});
