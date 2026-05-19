import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";

export const metadata = {
  title: "Privacy Policy | Aspirer Firm",
};

export default async function PrivacyPage() {
  const docPath = path.join(process.cwd(), "docs", "privacy-policy-draft.md");
  let content = "Privacy policy draft is not available yet.";

  try {
    content = await readFile(docPath, "utf8");
  } catch {
    content = "Privacy policy draft is not available yet.";
  }

  return (
    <main className="legal-page">
      <div className="wrap legal-wrap">
        <div className="legal-head">
          <span className="sec-tag mono">LEGAL</span>
          <h1>Privacy Policy</h1>
          <p>
            This page shows the current draft under attorney review for Aspirer Firm&apos;s
            website privacy policy.
          </p>
        </div>
        <div className="legal-nav mono" aria-label="Legal document navigation">
          <Link href="/privacy" className="is-active">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/confidentiality">Confidentiality</Link>
        </div>
        <article className="legal-card">
          <pre className="legal-pre">{content}</pre>
        </article>
      </div>
    </main>
  );
}
