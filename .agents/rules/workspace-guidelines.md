# Comclick 20 - Workspace & UI Standards

## 1. Development & Environment
- The user runs their development server on `http://localhost:3000`.
- Do not attempt to spawn additional background dev servers on conflicting ports.
- When verifying UI visually without a browser connection, use:
  ```bash
  google-chrome --headless=new --disable-gpu --window-size=1440,1200 --screenshot=<path> http://localhost:3000/<route>
  ```

## 2. Design & Anti-Slop Principles
- **No Generic AI Slop**: Enforce distinct visual hierarchy, intentional color tokens (`#5e97d3`, `#fbf3e0`, `#d98e89`, `#eccb7d`, `#b08b5f`), and high-contrast Thai typography (`Prompt` + `Anuphan`).
- **Double-Bezel Architecture**: Major cards and containers use nested shells (`doppel-shell` outer ring + `doppel-core` inner highlight) for physical depth.
- **Button-in-Button CTAs**: Interactive action buttons must feature nested circular icon capsules with kinetic hover tension.
- **Motion & Fluid Springs**: Use custom cubic-bezier spring tokens (`cubic-bezier(0.32, 0.72, 0, 1)`) for natural transitions instead of linear or abrupt animations.

## 3. Active Skills Integration
- Review interface changes against `.agents/skills/anti-ui-slop`, `.agents/skills/high-end-visual-design`, and `.agents/skills/improve-animations`.
- Adhere to `.agents/skills/vercel-react-best-practices` for Next.js App Router component tree and SSR safety.
