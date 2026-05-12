import fs from "node:fs";
import path from "node:path";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const source = fs.readFileSync(filePath, "utf8");
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
  loadEnvFile(path.join(root, ".env.local"));

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/google";
  const ownerEmail = process.env.GOOGLE_CALENDAR_OWNER_EMAIL || "aspirerfirm.dev@gmail.com";

  if (!clientId || !clientSecret) {
    console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local.");
    process.exit(1);
  }

  const { google } = await import("googleapis");
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const code = process.argv[2];

  if (!code) {
    const url = oauth2.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      login_hint: ownerEmail,
      scope: ["https://www.googleapis.com/auth/calendar.events"],
    });

    console.log("Open this URL in a browser, sign into the business Google account, then rerun this command with the returned code.");
    console.log("");
    console.log(url);
    console.log("");
    console.log("Example:");
    console.log("npm run google:owner-token -- 'PASTE_CODE_HERE'");
    return;
  }

  const { tokens } = await oauth2.getToken(code);
  if (!tokens.refresh_token) {
    console.error("Google did not return a refresh token. Re-run the flow and ensure prompt=consent is used.");
    process.exit(1);
  }

  console.log("Add this to .env.local:");
  console.log(`GOOGLE_OWNER_REFRESH_TOKEN=${tokens.refresh_token}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
