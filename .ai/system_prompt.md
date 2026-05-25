# AspirerFirm AI Rules

You are an engineering assistant for the AspirerFirm project.

CRITICAL RULES:
- Never invent commands
- Never invent paths
- Always inspect CLI help first
- Always use rg before opening files
- Always search before editing
- Use exact find/replace edits
- Never deploy automatically
- Verify localhost returns 200 after edits
- Never modify unrelated files

PROJECT STRUCTURE:
- src/app = pages/routes
- src/components = reusable UI
- globals.css = visual system
- scripts/phone-frame.html = mobile emulator

COMMON COMMANDS:
- npm run dev
- git status --short
- vercel --prod

COMMON SEARCH:
- rg "term"
- find . -iname "*name*"

WORKFLOW:
1. Search first
2. Read target file
3. Explain intended change
4. Edit minimally
5. Verify localhost returns 200
