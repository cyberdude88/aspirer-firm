import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";

export const metadata = {
  title: "Terms of Service | Aspirer Firm",
};

export default async function TermsPage() {
  const docPath = path.join(process.cwd(), "docs", "terms-of-service-coaching-agreement-draft.md");
  let content = "Terms of service draft is not available yet.";

  try {
    content = await readFile(docPath, "utf8");
  } catch {
    content = "Terms of service draft is not available yet.";
  }

  return (
    <main className="legal-page">
      <div className="wrap legal-wrap">
        <div className="legal-head">
          <span className="sec-tag mono">LEGAL</span>
          <h1>Terms of Service / Coaching Agreement</h1>
          <p>
            This page shows the current draft under attorney review for Aspirer Firm&apos;s
            coaching terms and engagement agreement.
          </p>
        </div>
        <div className="legal-nav mono" aria-label="Legal document navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms" className="is-active">Terms</Link>
          <Link href="/confidentiality">Confidentiality</Link>
        </div>
        <article className="legal-card">
          <pre className="legal-pre">{content}</pre>
        </article>
      </div>
    </main>
  );
}
