import { useState, useEffect } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  timeString: string;
  isToday: boolean;
  calendarName: string;
  location?: string;
  color?: string;
}

export function useAppleCalendar(): { events: CalendarEvent[]; loading: boolean; refresh: () => void } {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async () => {
    setLoading(true);
    if (window.electronAPI) {
      try {
        const data = await window.electronAPI.getCalendarEvents();
        if (data && Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents(getFallbackEvents());
        }
      } catch (e) {
        setEvents(getFallbackEvents());
      }
    } else {
      setEvents(getFallbackEvents());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    // 20-minute cached polling interval
    const interval = setInterval(fetchEvents, 1200000);
    return () => clearInterval(interval);
  }, []);

  return { events, loading, refresh: fetchEvents };
}

function getFallbackEvents(): CalendarEvent[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: 'evt-1',
      title: 'SYS ARCH // Core Telemetry Briefing',
      startDate: new Date(today.setHours(9, 30)).toISOString(),
      endDate: new Date(today.setHours(10, 15)).toISOString(),
      timeString: '09:30 AM',
      isToday: true,
      calendarName: 'Work',
      location: 'Command Deck 01',
      color: '#00F0FF'
    },
    {
      id: 'evt-2',
      title: 'QUANTUM DEV // Sprint Code Review',
      startDate: new Date(today.setHours(14, 0)).toISOString(),
      endDate: new Date(today.setHours(15, 0)).toISOString(),
      timeString: '02:00 PM',
      isToday: true,
      calendarName: 'Engineering',
      location: 'Virtual Matrix Sync',
      color: '#FF007F'
    },
    {
      id: 'evt-3',
      title: 'CYBER SECURITY // Infrastructure Audit',
      startDate: new Date(today.setHours(16, 30)).toISOString(),
      endDate: new Date(today.setHours(17, 30)).toISOString(),
      timeString: '04:30 PM',
      isToday: true,
      calendarName: 'Ops',
      location: 'Secure Terminal',
      color: '#FF6B00'
    },
    {
      id: 'evt-4',
      title: 'MARKET STAGING // Q3 Portfolio Rebalance',
      startDate: new Date(tomorrow.setHours(11, 0)).toISOString(),
      endDate: new Date(tomorrow.setHours(12, 0)).toISOString(),
      timeString: '11:00 AM',
      isToday: false,
      calendarName: 'Finance',
      location: 'WallSt Terminal',
      color: '#00FF66'
    },
    {
      id: 'evt-5',
      title: 'DEEP LEARNING // Neural Model Training',
      startDate: new Date(tomorrow.setHours(15, 30)).toISOString(),
      endDate: new Date(tomorrow.setHours(16, 30)).toISOString(),
      timeString: '03:30 PM',
      isToday: false,
      calendarName: 'AI Research',
      location: 'Cluster 04',
      color: '#00F0FF'
    }
  ];
}
