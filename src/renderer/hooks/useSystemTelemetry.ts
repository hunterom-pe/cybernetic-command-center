import { useState, useEffect } from 'react';

export interface TelemetryState {
  cpuLoad: number;
  cpuCores: number;
  ramUsedGB: number;
  ramTotalGB: number;
  ramUsagePercent: number;
  storageUsedPercent: number;
  storageUsedGB: number;
  storageTotalGB: number;
  batteryPercent: number;
  isCharging: boolean;
  hasBattery: boolean;
  historyCpu: { time: string; cpu: number }[];
  historyRam: { time: string; ram: number }[];
}

export function useSystemTelemetry(pollingMs: number = 2000): TelemetryState {
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    cpuLoad: 18,
    cpuCores: 8,
    ramUsedGB: 7.2,
    ramTotalGB: 16.0,
    ramUsagePercent: 45,
    storageUsedPercent: 52,
    storageUsedGB: 260,
    storageTotalGB: 500,
    batteryPercent: 94,
    isCharging: true,
    hasBattery: true,
    historyCpu: Array.from({ length: 12 }, (_, i) => ({ time: `${i}s`, cpu: 15 + Math.floor(Math.random() * 20) })),
    historyRam: Array.from({ length: 12 }, (_, i) => ({ time: `${i}s`, ram: 40 + Math.floor(Math.random() * 10) }))
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        if (window.electronAPI) {
          const data = await window.electronAPI.getSystemTelemetry();
          if (isMounted && data) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setTelemetry((prev) => {
              const newCpuHist = [...prev.historyCpu.slice(1), { time: timeStr, cpu: data.cpuLoad }];
              const newRamHist = [...prev.historyRam.slice(1), { time: timeStr, ram: data.ramUsagePercent }];
              return {
                ...data,
                historyCpu: newCpuHist,
                historyRam: newRamHist
              };
            });
          }
        } else {
          // Dev fallback simulation
          setTelemetry((prev) => {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const nextCpu = Math.max(5, Math.min(95, prev.cpuLoad + Math.floor((Math.random() - 0.5) * 10)));
            const nextRam = Math.max(20, Math.min(90, prev.ramUsagePercent + Math.floor((Math.random() - 0.5) * 4)));
            const newCpuHist = [...prev.historyCpu.slice(1), { time: timeStr, cpu: nextCpu }];
            const newRamHist = [...prev.historyRam.slice(1), { time: timeStr, ram: nextRam }];
            return {
              ...prev,
              cpuLoad: nextCpu,
              ramUsagePercent: nextRam,
              historyCpu: newCpuHist,
              historyRam: newRamHist
            };
          });
        }
      } catch (e) {
        console.error('Error fetching system stats:', e);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, pollingMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollingMs]);

  return telemetry;
}
