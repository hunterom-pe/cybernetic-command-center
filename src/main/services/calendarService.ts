import { execFile } from 'child_process';
import util from 'util';
import { shell } from 'electron';

const execFileAsync = util.promisify(execFile);

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
    await shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Calendars');
    return true;
  } catch (err) {
    try {
      await execFileAsync('open', ['-a', 'System Settings']);
      return true;
    } catch (e) {
      try {
        await execFileAsync('open', ['-a', 'System Preferences']);
        return true;
      } catch (e2) {
        return false;
      }
    }
  }
}

export async function requestCalendarPermission(): Promise<boolean> {
  try {
    await execFileAsync('open', ['-a', 'Calendar']);
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
  
  set rangeEnd to todayStart + (7 * 86400)
  set eventStr to ""
  repeat with aCal in calendars
    try
      set calEvents to (every event of aCal whose start date >= todayStart and start date < rangeEnd)
      repeat with anEvent in calEvents
        set eName to summary of anEvent
        set sDate to start date of anEvent
        set cName to name of aCal
        
        set sYear to (year of sDate) as string
        set sMonth to (month of sDate as integer) as string
        set sDay to (day of sDate) as string
        set sSec to time of sDate
        set sH to (sSec div 3600) as string
        set sM to ((sSec mod 3600) div 60) as string
        
        set timeFormatted to sYear & "-" & sMonth & "-" & sDay & " " & sH & ":" & sM
        set eventStr to eventStr & eName & "|||" & timeFormatted & "|||" & cName & "<<<EVENT>>>"
      end repeat
    end try
  end repeat
  return eventStr
end tell
  `;

  try {
    const { stdout } = await execFileAsync('osascript', ['-e', script]);
    const output = stdout.trim();
    if (!output) {
      return [];
    }

    const rawEvents = output.split('<<<EVENT>>>').filter((item) => item.trim().length > 0);
    const events: CalendarEvent[] = [];
    const now = new Date();
    const todayStr = now.toDateString();

    rawEvents.forEach((raw, index) => {
      const parts = raw.split('|||');
      if (parts.length >= 3) {
        const title = parts[0].trim();
        const dateStr = parts[1].trim(); // Format: "2026-8-3 14:30"
        const calendarName = parts[2].trim();

        const [dPart, tPart] = dateStr.split(' ');
        if (dPart && tPart) {
          const [year, month, day] = dPart.split('-').map((n) => parseInt(n, 10));
          const [hour, minute] = tPart.split(':').map((n) => parseInt(n, 10));

          const eventDate = new Date(year, month - 1, day, hour, minute || 0);

          let timeFormatted = 'All Day';
          if (hour > 0 || (minute && minute > 0)) {
            timeFormatted = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }

          const isToday = eventDate.toDateString() === todayStr;

          // Color coding by calendar name
          let color = '#00F0FF';
          const calLower = calendarName.toLowerCase();
          if (calLower.includes('work')) color = '#FF007F';
          else if (calLower.includes('home')) color = '#00FF66';
          else if (calLower.includes('mlb')) color = '#FF9900';

          events.push({
            id: `real-cal-${index}-${Date.now()}`,
            title: title || 'Calendar Directive',
            startDate: eventDate.toISOString(),
            endDate: new Date(eventDate.getTime() + 3600000).toISOString(),
            timeString: timeFormatted,
            isToday,
            calendarName,
            color
          });
        }
      }
    });

    // Sort by upcoming date & time
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return events;
  } catch (err) {
    return [];
  }
}
