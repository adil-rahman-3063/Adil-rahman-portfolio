# 🚀 OverWatch Open-Source Launch Campaign: All Social Posts

A complete, high-converting launch package for **OverWatch** across all major developer and social platforms, tagged with platform-specific `utm_source` tracking.

* **Live Interactive Simulator & Docs:** [overwatch.adilrahman.cc](https://overwatch.adilrahman.cc)
* **GitHub Repository:** [github.com/adil-rahman-3063/OverWatch](https://github.com/adil-rahman-3063/OverWatch)
* **Creator:** Adil Rahman ([adilrahman.cc](https://adilrahman.cc))

---

## Table of Contents
1. [X (Twitter) Viral Launch Thread (5 Tweets)](#1-x-twitter-viral-launch-thread)
2. [LinkedIn Technical Announcement](#2-linkedin-technical-announcement)
3. [Reddit Submissions (Tailored for 3 Subreddits)](#3-reddit-submissions)
   - [r/programming](#rprogramming-deep-technical--systems)
   - [r/webdev](#rwebdev-pwa-procedural-audio--ui)
   - [r/coolgithubprojects & r/selfhosted](#rcoolgithubprojects--rselfhosted-hardware-companion)
4. [Hacker News (Show HN)](#4-hacker-news-show-hn)
5. [Product Hunt / Indie Hackers Tagline & Pitch](#5-product-hunt--indie-hackers)
6. [Dev.to & Hashnode Quick Launch Announcement](#6-devto--hashnode-announcement)

---

## 1. X (Twitter) Viral Launch Thread

### Tweet 1 (The Hook):
I turned an old, unused smartphone into a physical "Fail-Closed" hardware security interlock for AI coding agents (and a tactile OLED desk deck).

No Electron. No bloated app store installs. 100% open source.

Meet OverWatch 🛡️⚡

Try the live deck simulator:
https://overwatch.adilrahman.cc?utm_source=x

Thread 🧵👇 (1/5)

---

### Tweet 2 (The Problem):
As terminal agents like Antigravity & Claude Code become more autonomous, running them with `--dangerously-skip-permissions` is terrifying.

But clicking desktop IDE permission popups every 30 seconds completely destroys developer flow.

There had to be a better way. (2/5)

---

### Tweet 3 (The Security Law):
OverWatch turns your phone resting on a MagSafe stand into an authorized hardware token:

• When the agent proposes a bash/terminal command, your phone rings across the room
• Tap ALLOW to execute on your PC
• STRICT Fail-Closed: If you walk away or 20s expires -> HARD KILL (3/5)

---

### Tweet 4 (The StandBy Deck):
When you're not approving commands, OverWatch is a minimalist OLED `#000000` desk driver:

🕰️ 3D Split-Flap Clock (procedural Web Audio, zero audio lag)
🎵 Windows WinRT Media Control (Spotify / YouTube Music)
⚡ PC Hardware & Token Quota Telemetry
📸 1-Tap Screen & Clipboard Beaming (4/5)

---

### Tweet 5 (Call to Action):
OverWatch is 100% open source under the MIT License.
Setup takes 1 click on Windows (`setup.bat`).

⭐️ Star the repo on GitHub:
https://github.com/adil-rahman-3063/OverWatch

🎮 Test the 1:1 Live Deck Simulator:
https://overwatch.adilrahman.cc?utm_source=x

Built by @AdilR 🛠️ (5/5)

---

## 2. LinkedIn Technical Announcement

**Title / First Lines:**
Why I turned an old smartphone into a physical "Fail-Closed" hardware interlock for autonomous AI coding agents.

If you use autonomous CLI agents like Google Antigravity, Claude Code, or Codex in your daily workflow, you know the dilemma:
1. Run with auto-approve flags (`--dangerously-skip-permissions`) and pray your agent doesn't wipe directories or leak environment secrets.
2. Or sit glued to your screen clicking desktop IDE permission dialogs every 30 seconds, completely killing your flow state.

I built **OverWatch** to solve this.

OverWatch connects an old smartphone resting on a desk MagSafe stand to your Windows workstation via end-to-end encrypted Supabase Realtime WebSockets and a lightweight system tray daemon (Node.js + WinRT).

Here is how the architecture works:

1. **Native `PreToolUse` Lifecycle Interception:**
When Antigravity attempts to run a terminal command, OverWatch pauses execution on the host machine and beams the payload to your phone over local IPC and WebSockets.

2. **The "Fail-Closed" Security Law:**
If you walk away, the 20-second countdown expires, your phone is disconnected, or the PC daemon is paused—the command is instantly aborted with code 1. Zero clicks needed on the PC. Your phone is the sole physical token.

3. **Beating Mobile Autoplay Policies:**
Mobile browsers aggressively mute background audio without direct touch gestures. We implemented a 15-second inaudible keep-alive heartbeat (`gain = 0.00001`) paired with pre-armed HTML5 PCM WAV chimes and haptic vibrations so your phone rings across the room when an agent needs permission.

4. **Minimalist OLED `#000000` StandBy Desk Deck:**
When you aren't approving commands, your phone becomes a tactile workstation companion:
• 3D mechanical split-flap clock with real-time Web Audio sound synthesis (no heavy MP3 downloads)
• Windows WinRT media controls that never accidentally unpause old YouTube browser tabs
• Live CPU, RAM, and rolling token quota reset countdowns
• Bidirectional image & clipboard beaming via native C# utilities

OverWatch is 100% open-source (MIT). Setup is automated via a 1-click Windows runner (`setup.bat`).

Test the 1:1 live interactive simulator:
👉 https://overwatch.adilrahman.cc?utm_source=linkedin

GitHub Repository:
👉 https://github.com/adil-rahman-3063/OverWatch

I'd love to hear how you manage security permissions for autonomous coding agents!

#OpenSource #ArtificialIntelligence #SoftwareEngineering #WebDevelopment #CyberSecurity #NodeJS #DevOps

---

## 3. Reddit Submissions

### r/programming (Deep Technical & Systems)

**Title:**
I built OverWatch: A physical "fail-closed" hardware interlock for AI coding agents and an OLED desk companion (WinRT, C#, WebSockets)

**Post:**
Hey r/programming,

As terminal coding assistants (Claude Code, Antigravity) gain autonomy, the developer permission UX has become a huge annoyance: you either give the agent blanket sudo/exec permissions (dangerous), or you get interrupted by desktop permission popups every 30 seconds.

I built **OverWatch** to turn an old smartphone resting on a MagSafe stand into an out-of-band physical hardware token and OLED desk companion.

A few interesting technical problems we ran into and solved:

1. **Windows Defender AMSI Heuristic False Positives:**
Initially, we used PowerShell scripts for high-DPI desktop capture. Calling Win32 P/Invoke (`SetProcessDPIAware`) alongside `Graphics.CopyFromScreen` triggered Defender's AMSI heuristic spyware rule (`ScriptContainedMaliciousContent`). We replaced PowerShell with a 12KB native C# utility auto-compiled via Windows' built-in `csc.exe` (.NET 4.0), dropping capture latency from 750ms to 18ms.

2. **PowerShell UTF-16LE Encoding:**
Node.js standard UTF-8 Base64 strings sent to PowerShell's `-EncodedCommand` corrupted adjacent bytes into garbage glyphs. PowerShell strictly expects UTF-16LE, which required `Buffer.from(cmd, 'utf16le')`.

3. **Beating Mobile Browser Audio Autoplay Sleep:**
Mobile Safari and Android Chrome aggressively suspend `AudioContext` engines when idling in StandBy mode. We bypassed this with an inaudible 15-second keep-alive pulse (`gain = 0.00001`) and a pre-armed 16-bit PCM WAV dual-tone chime preloaded during PIN lock unlock.

4. **CSS 3D Procedural Audio Clock:**
The mechanical split-flap clock runs with CSS 3D perspectives (`perspective: 800px`, `rotateX`). To avoid audio asset lag, the leaf snap is synthesized via Web Audio: a 22ms bandpass noise burst (2600Hz, Q=3.2) plus a 220Hz->50Hz triangle wave thud for the plastic housing resonance.

Live Interactive Deck Simulator & Architecture:
https://overwatch.adilrahman.cc?utm_source=reddit

GitHub (MIT):
https://github.com/adil-rahman-3063/OverWatch

Feedback and PRs are welcome!

---

### r/webdev (PWA, Procedural Audio & UI)

**Title:**
Showoff Saturday: I built a zero-bloat OLED StandBy Desk Deck in React + Vite with synthesized Web Audio and real-time PC telemetry

**Post:**
Hey r/webdev!

Instead of letting old smartphones collect dust in a drawer, I built **OverWatch**—a web-first OLED `#000000` desk deck designed for phones resting in landscape mode on MagSafe chargers.

Tech Stack:
- **Frontend:** React 19, Vite, Tailwind CSS, TypeScript, Web Audio API, Web Share API
- **Backend Daemon:** Node.js, WinRT (via PowerShell/C#), Supabase Realtime WebSockets
- **Deployment:** Cloudflare Pages (Landing Simulator)

Features:
• **Retro 3D Split-Flap Clock:** Fold animations in pure CSS with procedural audio synthesis (zero MP3 network requests).
• **Windows Media Sessions:** Real-time track display and controls via WinRT.
• **AI Coding Interlock:** Ring alerts and 1-tap approvals for terminal coding agents (Antigravity / Claude Code) with strict fail-closed timeouts.
• **Bidirectional Image Beaming:** 1-tap mobile camera snap directly to Windows clipboard.
• **Safari PWA Standalone Fixes:** Portaled modal lightboxes via `createPortal` to solve WebKit's `position: fixed` inside `transform: translateX()` bug, and Web Share API downloads.

Check out the 1:1 live simulator running in the browser:
https://overwatch.adilrahman.cc?utm_source=reddit

Source code:
https://github.com/adil-rahman-3063/OverWatch

Let me know what you think of the split-flap audio synthesis!

---

### r/coolgithubprojects & r/selfhosted (Hardware Companion)

**Title:**
OverWatch: Repurpose any old smartphone into an OLED StandBy desk companion & physical AI interlock (Open Source)

**Post:**
Tired of second monitors cluttered with oversized browser windows, or letting old phones rot in desk drawers?

OverWatch turns any smartphone on a MagSafe stand into a dedicated, pitch-black OLED workstation deck:
- 🕰️ Mechanical 3D split-flap clock & custom focus timers
- 🎵 Windows media controller (Spotify, YouTube Music)
- 📊 PC CPU, RAM, and token quota telemetry
- 🛡️ Physical "Fail-Closed" approval interlock for AI coding agents
- 📸 Instant screen & clipboard transfer between PC and phone

Zero mobile apps to install (pure PWA). Zero cloud subscriptions.

Explore the project & live simulator:
https://overwatch.adilrahman.cc?utm_source=reddit

GitHub repo:
https://github.com/adil-rahman-3063/OverWatch

---

## 4. Hacker News (Show HN)

**Submission Title:**
Show HN: OverWatch – Repurposing an old phone into an OLED desk deck and AI interlock

**Post Body:**
Hi HN,

I built OverWatch to solve two problems I had at my desk:

1. **Permission fatigue with autonomous coding agents:** Running terminal agents (Claude Code, Google Antigravity) with `--dangerously-skip-permissions` is reckless, but clicking desktop IDE dialogs every 30 seconds breaks focus. OverWatch turns an old phone on a MagSafe desk stand into a physical "Fail-Closed" approval gate. When an agent proposes a terminal command, the phone chimes, shows the command, and gives you 20s to tap Allow. If you ignore it or the daemon disconnects, the command is terminated.

2. **Repurposing old phone hardware:** Instead of running heavy Electron dashboards, the phone runs a pure OLED `#000000` PWA that handles Windows WinRT media sessions, PC hardware health, and a 3D mechanical split-flap clock with real-time procedural Web Audio sound synthesis (no static audio files).

The Windows companion service runs quietly in the system tray, communicating with the phone via Supabase Realtime WebSockets.

A major systems hurdle was Windows Defender AMSI flagging inline PowerShell P/Invoke screen captures as spyware; we replaced it with a 12KB native C# binary compiled on the fly using Windows' pre-installed `csc.exe` (.NET 4.0), cutting execution latency to under 30ms.

Project site & 1:1 interactive deck simulator:
https://overwatch.adilrahman.cc?utm_source=hackernews

Open-source repo:
https://github.com/adil-rahman-3063/OverWatch

I would love your thoughts on the architecture and security model!

---

## 5. Product Hunt / Indie Hackers

### Tagline:
Turn any old phone into an OLED desk deck & AI hardware interlock 🛡️⚡

### Short Pitch (60 words):
OverWatch repurposes your old smartphone into a tactile OLED `#000000` StandBy desk deck and physical security interlock for autonomous AI coding agents. Enjoy real-time WinRT media controls, 3D mechanical flip clocks, PC telemetry, and 1-tap fail-closed terminal command approvals. Zero Electron. 100% open-source.

### Key Features Checklist:
- 🛡️ **Physical AI Interlock:** Fail-closed terminal command authorization for Antigravity & Claude Code
- 🕰️ **3D Split-Flap Clock:** Procedural Web Audio synthesized mechanical ticks
- 🎵 **Windows WinRT Media Control:** Isolated control for Spotify & YouTube Music
- 📊 **Live Telemetry:** CPU, RAM, and AI model quota countdowns
- 📸 **Bidirectional Beaming:** Instant photo-to-clipboard and desktop capture
- ⚡ **1-Click Windows Setup:** Native system tray daemon with auto-restart watchdog

**Link:** https://overwatch.adilrahman.cc?utm_source=producthunt

---

## 6. Dev.to & Hashnode Announcement

```markdown
# Introducing OverWatch: An Open-Source OLED Desk Companion & AI Hardware Interlock

Most desk setups suffer from two issues:
1. An old smartphone sitting unused in a drawer.
2. The constant anxiety of running autonomous coding agents in the terminal.

We built **OverWatch** to solve both simultaneously.

### What is OverWatch?
OverWatch is an open-source, web-first workstation companion designed for smartphones resting in landscape mode on a MagSafe charger.

It connects to your Windows PC via a lightweight background daemon (running quietly in the system tray) and encrypted WebSockets.

### Core Capabilities:
* **The "Fail-Closed" AI Security Gate:** Every bash or terminal command proposed by an agent halts execution until you tap ALLOW on your phone. If you don't respond within 20 seconds, the command is aborted.
* **3D Mechanical Split-Flap Clock:** Complete with synthesized plastic leaf snaps created using the Web Audio API (zero audio files to download).
* **True WinRT Media Sessions:** Play, pause, and skip music on Spotify or YouTube Music without waking up paused browser video tabs.
* **Screen & Clipboard Beamer:** Snap mobile photos directly to the Windows clipboard, or capture your desktop monitor with high-DPI accuracy.

### Try It Live:
You can play with the 1:1 live simulator right in your browser (no installation needed):
👉 [https://overwatch.adilrahman.cc?utm_source=devto](https://overwatch.adilrahman.cc?utm_source=devto)

Check out the repository, star the project, and contribute on GitHub:
👉 [https://github.com/adil-rahman-3063/OverWatch](https://github.com/adil-rahman-3063/OverWatch)
```
