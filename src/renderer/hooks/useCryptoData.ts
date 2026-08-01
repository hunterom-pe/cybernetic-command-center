import { useState, useEffect } from 'react';
import { CryptoTickerData } from '../types/hud';

const INITIAL_CRYPTO: CryptoTickerData[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', priceUsd: 64850.00, change24hPercent: 2.45, high24h: 65900, low24h: 63100, sparkline: [63200, 63800, 64100, 64500, 64850] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', priceUsd: 3480.20, change24hPercent: -0.85, high24h: 3560, low24h: 3420, sparkline: [3520, 3500, 3490, 3470, 3480] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', priceUsd: 148.60, change24hPercent: 5.12, high24h: 152, low24h: 139, sparkline: [140, 142, 145, 146, 148.6] }
];

export function useCryptoData(pollingMs: number = 5000): CryptoTickerData[] {
  const [cryptos, setCryptos] = useState<CryptoTickerData[]>(INITIAL_CRYPTO);

  useEffect(() => {
    let isMounted = true;

    const fetchGecko = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=5&page=1&sparkline=true'
        );
        if (!res.ok) throw new Error('Gecko rate limited');
        const data = await res.json();

        if (isMounted && Array.isArray(data) && data.length > 0) {
          const parsed: CryptoTickerData[] = data.map((item: any) => ({
            id: item.id,
            symbol: item.symbol.toUpperCase(),
            name: item.name,
            priceUsd: item.current_price,
            change24hPercent: Number(item.price_change_percentage_24h?.toFixed(2) || 0),
            high24h: item.high_24h || item.current_price * 1.03,
            low24h: item.low_24h || item.current_price * 0.97,
            sparkline: item.sparkline_in_7d?.price?.slice(-10) || [item.current_price]
          }));
          setCryptos(parsed);
          return;
        }
      } catch (err) {
        // Fallback simulation if offline or rate limited
        if (isMounted) {
          setCryptos((prev) =>
            prev.map((coin) => {
              const delta = (Math.random() - 0.49) * (coin.priceUsd * 0.002);
              const newPrice = Number((coin.priceUsd + delta).toFixed(2));
              return {
                ...coin,
                priceUsd: newPrice,
                sparkline: [...coin.sparkline.slice(1), newPrice]
              };
            })
          );
        }
      }
    };

    fetchGecko();
    const interval = setInterval(fetchGecko, pollingMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingMs]);

  return cryptos;
}
