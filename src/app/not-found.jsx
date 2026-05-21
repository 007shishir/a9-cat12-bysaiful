
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="w-full min-h-[85vh] bg-base-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-base-content">
      <div className="text-center max-w-md mx-auto space-y-6">
        
        {/* Large stylized 404 design code badge */}
        <div className="relative inline-block">
          <h1 className="text-9xl font-black tracking-tighter text-primary/10 select-none animate-pulse">
            404
          </h1>
          <p className="absolute inset-0 flex items-center justify-center text-4xl font-black tracking-tight text-base-content">
            Oops!
          </p>
        </div>

        {/* Informative text descriptors */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Page Not Found
          </h2>
          <p className="text-sm text-base-content/60 font-medium max-w-xs mx-auto">
            The link you followed might be broken, or the page may have been permanently removed by our administrators.
          </p>
        </div>

        {/* Simple navigation return trigger button links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link 
            href="/" 
            className="btn btn-primary w-full sm:w-auto rounded-xl font-bold normal-case px-6 shadow-lg shadow-primary/10"
          >
            Go to Homepage
          </Link>
          <Link 
            href="/rooms" 
            className="btn btn-ghost w-full sm:w-auto rounded-xl font-bold normal-case px-6 border border-base-content/10"
          >
            Browse Study Rooms
          </Link>
        </div>

      </div>
    </main>
  );
}