import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";
import { LegalMarkdown } from "@/components/LegalMarkdown";

export const metadata = {
  title: "Confidentiality Policy | Aspirer Firm",
};

export default async function ConfidentialityPage() {
  const docPath = path.join(process.cwd(), "docs", "confidentiality-policy-draft.md");
  let content = "Confidentiality policy draft is not available yet.";

  try {
    content = await readFile(docPath, "utf8");
  } catch {
    content = "Confidentiality policy draft is not available yet.";
  }

  return (
    <main className="legal-page">
      <div className="wrap legal-wrap">
        <div className="legal-head">
          <span className="sec-tag mono">LEGAL</span>
          <h1>Confidentiality Policy</h1>
          <p>
            This page shows the current client-facing confidentiality draft under attorney review for
            Aspirer Firm&apos;s coaching practice.
          </p>
        </div>
        <div className="legal-nav mono" aria-label="Legal document navigation">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/confidentiality" className="is-active">Confidentiality</Link>
        </div>
        <article className="legal-card">
          <LegalMarkdown content={content} />
        </article>
      </div>
    </main>
  );
}
