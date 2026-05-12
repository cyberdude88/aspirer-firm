export function Footer() {
  return (
    <footer className="mt-24 border-t border-gray-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-gray-500 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} aspirer-firm</p>
        <p className="flex items-center gap-3">
          <span>Next.js</span>
          <span>·</span>
          <span>Supabase</span>
          <span>·</span>
          <span>Stripe</span>
          <span>·</span>
          <span>Google</span>
        </p>
      </div>
    </footer>
  );
}
