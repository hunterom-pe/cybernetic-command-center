# VISUAL DESIGN SYSTEM: CYBERPUNK HUD & GLASSMORPHISM

This rule file defines and enforces the design system for the **Command Center** macOS desktop application. All UI components, widgets, and layouts must strictly adhere to these rules.

---

## 1. PALETTE & BRAND COLOR TOKENS

- **App Background**: `#08080C` (Deep Obsidian) with `radial-gradient(#1A1A24 1px, transparent 1px)` grid pattern (16px x 16px background size).
- **Widget Containers**: Frosted dark glass (`background: rgba(18, 18, 24, 0.75)`, `backdrop-filter: blur(12px)`, border: `1px solid #2A2A36`).
- **Primary Color Tokens & Accents**:
  - **Electric Cyan (`#00F0FF`)**: Primary telemetry, clock digits, crypto tickers, weather temp curves, default active glowing borders.
  - **Neon Magenta (`#FF007F`)**: Secondary accents, Spotify music controls, calendar agenda highlights, badge glow.
  - **Laser Orange (`#FF6B00`)**: Pomodoro break states, priority alerts, milestone countdown glow.
  - **Acid Green (`#00FF66`)**: Market gain indicators, completed task checkboxes, online/charging state, focus sprint active state.
  - **Tactical Red (`#FF3B30`)**: Market dip indicators, urgent alert badges, priority tags, delete action buttons.
  - **Muted Steel (`#525266` / `#8E8EA0`)**: Secondary text, inactive tab borders, grid line accents.

---

## 2. TYPOGRAPHY RULES

- **Monospaced Data**: Monospace font family (`JetBrains Mono`, `SF Mono`, `Fira Code`, `ui-monospace`) MUST be used for:
  - All numerical values, clock digits, timecodes, percentages, and currencies.
  - Widget header prefixes (`SYS_PERF //`, `MARKETS //`, `SPOTIFY //`, etc.).
  - Coordinates, temperature readings, battery load stats.
- **Sans-serif Labels**: Geometric sans-serif (`SF Pro`, `Inter`, `system-ui`) for body text, task titles, meeting names, and modal dialog text.
- **Uppercase Monospaced Header Format**:
  - Every widget header must feature an uppercase monospaced prefix with glowing Lucide icons set to `1.5px` stroke width.
  - Pattern: `<Icon size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" /> <span className="font-mono text-xs tracking-wider text-cyan-400 font-bold">WIDGET_NAME //</span>`

---

## 3. GLASSMORPHIC HUD CARD SPECIFICATIONS

- Border Radius: `rounded-xl` (12px) or `rounded-lg` (8px).
- Box Shadows: Subtle neon outer glow on hover or active state (`shadow-[0_0_15px_rgba(0,240,255,0.15)]`).
- Background: `bg-[#121218]/80 backdrop-blur-md border border-[#2A2A36]`.
- Scanline Overlay: Faint animated SVG/CSS scanline effect across top-level background.

---

## 4. ANIMATIONS & MICRO-INTERACTIONS

- Framer Motion `initial={{ opacity: 0, scale: 0.98 }}` `animate={{ opacity: 1, scale: 1 }}` transition: `0.3s cubic-bezier(0.16, 1, 0.3, 1)`.
- Digital Glitch Boot Reveal when app or widget mounts.
- Audio Equalizer: Smooth CSS/Framer motion bar animations for playback visualizer.
- Button Hovers: Slight brightness increase, cyan/magenta edge glow, scale `1.02`.

---

## 5. ACCESSIBILITY & CONTRAST

- Minimum contrast ratio for text: 4.5:1 on frosted background.
- Interactive controls must have clear focus ring styles (`focus:ring-2 focus:ring-[#00F0FF] focus:outline-none`).
- Monospaced numeric alignment (`tabular-nums`) to prevent layout jitter during live telemetry updates.
