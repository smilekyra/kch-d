import { MainNav } from "@/components/MainNav";

export default function PerformanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="bg-white shrink-0">
        <MainNav />
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {children}
      </main>
    </div>
  );
}
