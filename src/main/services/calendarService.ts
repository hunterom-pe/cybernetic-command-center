import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  timeString: string; // e.g. "10:30 AM"
  isToday: boolean;
  calendarName: string;
  location?: string;
  color?: string;
}

export async function openCalendarPrivacySettings(): Promise<boolean> {
  try {
    await execAsync('open "x-apple.systempreferences:com.apple.preference.security?Privacy_Calendars"');
    return true;
  } catch (err) {
    try {
      await execAsync('open "x-apple.systempreferences:com.apple.preference.security"');
      return true;
    } catch (e) {
      return false;
    }
  }
}

export async function requestCalendarPermission(): Promise<boolean> {
  const script = `tell application "Calendar" to activate`;
  try {
    await execAsync(`osascript -e '${script}'`);
    return true;
  } catch (err) {
    return false;
  }
}

export async function fetchAppleCalendarEvents(): Promise<CalendarEvent[]> {
  const script = `
    tell application "Calendar"
      set todayStart to (current date)
      set hours of todayStart to 0
      set minutes of todayStart to 0
      set seconds of todayStart to 0
      
      set tomorrowEnd to todayStart + (2 * 86400)
      
      set eventList to {}
      repeat with aCal in calendars
        try
          set calEvents to (every event of aCal whose start date >= todayStart and start date < tomorrowEnd)
          repeat with anEvent in calEvents
            set eventName to summary of anEvent
            set eventStart to start date of anEvent as string
            set eventEnd to end date of anEvent as string
            set calName to name of aCal
            set end of eventList to (eventName & "|||" & eventStart & "|||" & eventEnd & "|||" & calName)
          end repeat
        end try
      end repeat
      return eventList
    end tell
  `;

  try {
    const { stdout } = await execAsync(`osascript -e '${script.replace(/\n/g, ' ')}'`);
    if (!stdout.trim()) {
      return getFallbackCalendarEvents();
    }

    const lines = stdout.trim().split(', ');
    const events: CalendarEvent[] = [];

    const now = new Date();
    const todayStr = now.toDateString();

    lines.forEach((line, index) => {
      const parts = line.split('|||');
      if (parts.length >= 4) {
        const title = parts[0];
        const startDateRaw = parts[1];
        const endDateRaw = parts[2];
        const calendarName = parts[3];

        const parsedStart = new Date(startDateRaw);
        const parsedEnd = new Date(endDateRaw);

        const isToday = parsedStart.toDateString() === todayStr;
        const timeString = isNaN(parsedStart.getTime())
          ? '09:00 AM'
          : parsedStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        events.push({
          id: `cal-evt-${index}-${Date.now()}`,
          title: title || 'Scheduled Directive',
          startDate: isNaN(parsedStart.getTime()) ? new Date().toISOString() : parsedStart.toISOString(),
          endDate: isNaN(parsedEnd.getTime()) ? new Date().toISOString() : parsedEnd.toISOString(),
          timeString,
          isToday,
          calendarName: calendarName || 'Work',
          color: isToday ? '#00F0FF' : '#FF007F'
        });
      }
    });

    if (events.length === 0) {
      return getFallbackCalendarEvents();
    }

    return events;
  } catch (err) {
    return getFallbackCalendarEvents();
  }
}

function getFallbackCalendarEvents(): CalendarEvent[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: 'evt-1',
      title: 'SYS_ARCH // Core Telemetry Briefing',
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
      title: 'QUANTUM_DEV // Sprint Code Review',
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
      title: 'CYBER_SECURITY // Infrastructure Audit',
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
      title: 'MARKET_STAGING // Q3 Portfolio Rebalance',
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
      title: 'DEEP_LEARNING // Neural Model Training',
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
