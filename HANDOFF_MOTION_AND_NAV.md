# Handoff — Background Motion, Landscape Nav, Booking Theme

_Date: 2026-05-25. Written to be followed step-by-step by a small local model (e.g. ollama/qwen) or a human. Every step is a copy-paste command or an exact find/replace. Do not improvise._

---

## 0. Rules for whoever executes this

1. Run every command from the project folder: `/home/alex/projects/aspirer-firm`.
2. Edit files with exact find-and-replace. The "FIND" text is unique in the file. Replace it with the "REPLACE" text. Do not change anything else.
3. After editing, always check it still compiles (Step 5).
4. **Nothing here is live until you deploy (Step 7).** Editing files only changes the local copy.

---

## 1. Start the local site

```bash
cd /home/alex/projects/aspirer-firm
npm run dev
```

Leave it running. The site is now at **http://localhost:3000**.

---

## 2. Open the phone preview

In a second terminal:

```bash
xdg-open /home/alex/projects/aspirer-firm/scripts/phone-frame.html
```

This shows the site inside a phone frame. Buttons at the top:

- **⟳ rotate** — switch between portrait (393×852) and landscape (852×393).
- **↻ reload** — reload the phone screen.
- **▶ replay intro** — opens a fresh window so the one-time logo intro animation plays again (it only plays once per browser session).
- **/ home, /about, /resources, /booking** — change the page shown.

If the buttons are missing, the browser is showing an old copy: press **Ctrl+Shift+R** on the phone-preview page.

---

## 3. What was changed today (so you know what each knob does)

All visual changes are in TWO files:

- `src/app/globals.css`
- `src/components/FloatingBackgroundLogo.tsx`

Plus one page themed for light mode:

- `src/app/booking/[service]/page.tsx`

Summary:

1. **Background logo (mobile):** two faint logo "ghosts". They overlap at the top of the page; as you scroll, one rises and one drops (a split). On desktop the old multi-copy drift is unchanged.
2. **Landscape header:** collapsed to one slim row so page content is visible. Logo is hard-left, "ASPIRER FIRM" sits beside it on one line.
3. **Wordmark slide-in:** the words "ASPIRER" and "FIRM" fly in from opposite screen edges and overlap before settling. This now happens on **all** screen sizes.
4. **Booking page** (`/booking/discovery-call`): now readable in light/day mode (was white-on-white).
5. Removed dead CSS (`.slashes`) that was never shown.

---

## 4. Tuning knobs (change a number, save, reload)

Each knob below: the file, the exact text to find, and what the number does.

### 4a. How far the two background logos split on scroll
File: `src/components/FloatingBackgroundLogo.tsx`
FIND:
```js
const MOBILE_TRAVEL = () => window.innerHeight * 0.25;
```
`0.25` = each logo moves up/down by up to 25% of the screen height over the full scroll.
- Bigger number (e.g. `0.35`) = they spread further apart.
- Smaller number (e.g. `0.12`) = they stay closer / barely split.

### 4b. Size of "ASPIRER FIRM" in landscape
File: `src/app/globals.css`
FIND (there are two lines, change both — `main` and `sub`):
```css
.brand-word-hero .brand-line-main{font-size:clamp(22px,8vh,40px);letter-spacing:.18em}
.brand-word-hero .brand-line-sub{font-size:clamp(22px,8vh,40px);letter-spacing:.22em;margin-top:0;line-height:1}
```
The `clamp(MIN, PREFERRED, MAX)` controls size. To make the words bigger, raise `40px` (the MAX) and/or `8vh` (the preferred). Example for bigger: `clamp(24px,9vh,48px)`. Change the same numbers on BOTH lines so the two words match.

### 4c. How far across the screen the words slide in
File: `src/app/globals.css`
FIND:
```css
  --tx:-88vw;
```
and
```css
.brand-word-hero .brand-line-sub{--tx:88vw}
```
`88vw` = the word starts 88% of the screen width away and slides in. Bigger = longer sweep. Keep one negative (`-88vw`, slides from left) and one positive (`88vw`, slides from right) so they cross.

### 4d. Landscape header thinness
File: `src/app/globals.css`
FIND:
```css
  .nav{flex-direction:row;align-items:center;justify-content:space-between;padding:6px 20px 6px 16px;gap:14px}
```
The `padding:6px 20px 6px 16px` is top/right/bottom/left. Lower the first/third numbers (e.g. `4px ... 4px ...`) to make the bar even thinner.

---

## 5. Check it still works after any edit

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

- Prints `200` = good.
- Prints anything else, or the `npm run dev` terminal shows red error text = you broke something. Undo your last edit.

Then reload the phone preview (↻ button) to see the change.

---

## 6. Files touched today (for reference / git)

```bash
cd /home/alex/projects/aspirer-firm
git status --short
```
Expected changed files include:
- `src/app/globals.css`
- `src/components/FloatingBackgroundLogo.tsx`
- `src/app/booking/[service]/page.tsx`
- `scripts/phone-frame.html` (the preview tool)

---

## 7. Deploy to the live site (aspirerfirm.com)

**IMPORTANT:** This site does NOT auto-deploy from GitHub. `git push` alone changes nothing live. The live site only updates when someone runs this:

```bash
cd /home/alex/projects/aspirer-firm
vercel --prod
```

`vercel --prod` publishes the current folder. So make sure the site looks right locally (Steps 2–5) BEFORE running it. If a login is needed, run `vercel login` first.

---

## 8. If something looks wrong

- **Logo split not visible:** make sure you are in PORTRAIT in the phone preview, and scroll down. They overlap at the very top.
- **Words "ASPIRER FIRM" stacked or huge in landscape:** hard-refresh the preview page (Ctrl+Shift+R). The browser may be caching old CSS.
- **Horizontal scrollbar appears:** confirm this line exists in `src/app/globals.css`:
  ```css
  body{font-weight:400;line-height:1.5;overflow-x:clip}
  ```
  The `overflow-x:clip` is what hides the off-screen part of the word sweep.
- **Logo intro animation "gone":** it only plays once per browser session by design. Use **▶ replay intro**, or open the site in a private window.
