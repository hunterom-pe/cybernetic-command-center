import { useState, useEffect } from 'react';
import { StockTickerData } from '../types/hud';

const INITIAL_STOCKS: StockTickerData[] = [
  { symbol: 'S&P 500', name: 'SPX Index', price: 5432.18, change: 28.45, changePercent: 0.53, sparkline: [5400, 5410, 5405, 5420, 5418, 5432] },
  { symbol: 'NASDAQ', name: 'IXIC Index', price: 17892.40, change: 142.10, changePercent: 0.80, sparkline: [17700, 17750, 17800, 17820, 17892] },
  { symbol: 'DOW', name: 'DJI Index', price: 40842.10, change: -48.20, changePercent: -0.12, sparkline: [40900, 40880, 40850, 40860, 40842] },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 224.50, change: 3.15, changePercent: 1.42, sparkline: [221, 222, 223, 223.8, 224.5] },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 128.75, change: 4.80, changePercent: 3.87, sparkline: [122, 124, 125.5, 127, 128.75] }
];

export function useMarketData(pollingMs: number = 4000): StockTickerData[] {
  const [stocks, setStocks] = useState<StockTickerData[]>(INITIAL_STOCKS);

  useEffect(() => {
    const updatePrices = () => {
      setStocks((prev) =>
        prev.map((stock) => {
          const delta = (Math.random() - 0.48) * (stock.price * 0.003);
          const newPrice = Number((stock.price + delta).toFixed(2));
          const newChange = Number((stock.change + delta).toFixed(2));
          const newPercent = Number(((newChange / (stock.price - newChange)) * 100).toFixed(2));
          const newSparkline = [...stock.sparkline.slice(1), newPrice];

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newPercent,
            sparkline: newSparkline
          };
        })
      );
    };

    const interval = setInterval(updatePrices, pollingMs);
    return () => clearInterval(interval);
  }, [pollingMs]);

  return stocks;
}
