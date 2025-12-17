# BAN Jarvis MK. V - System Architecture & Design

## 🎯 Objective
Build a local, privacy-focused AI Commander for macOS.
Design Aesthetic: "Global Command" (Rotating Earth Hologram, Neon Cyan UI).

## 🛠 Core Architecture
1. **The Brain (Next.js):** Handles Voice, Vision, UI, and Reasoning.
2. **The Sidecar (Node.js):** Handles System Commands, Git, Browser Automation, and File I/O.

## 💎 UI Specification (Reference Image)
- **Central:** Rotating Wireframe Globe (`#00ffff` wireframe, `#001020` fill).
- **Overlays:** Curved UI rings, Red/Cyan status markers.
- **Typography:** Monospace, "Mission Day" counters, "Cam:A2" labels.

## 🤖 Agent Capabilities
The AI Router (`app/api/chat/route.ts`) connects to the Sidecar to execute:
- `findFile`: Uses `mdfind` (Spotlight).
- `gitPush`: Automates git ops.
- `browserAutomate`: Puppeteer for web tasks.