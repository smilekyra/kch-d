"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/m3-performance", label: "홈" },
  { href: "/m3-performance/kpi-input", label: "KPI 입력" },
  { href: "/m3-performance/eval", label: "평가 진행" },
  { href: "/m3-performance/result", label: "등급별 비율" },
  { href: "/m3-performance/salary", label: "성과급 산출" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="h-16 border-b border-border px-8 flex items-center justify-between bg-white max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-8">
        <div className="text-primary font-extrabold text-xl tracking-tighter">
          KCH <span className="font-normal text-muted-foreground">HR MODULE</span>
        </div>
        <div className="flex h-10 bg-muted p-1 rounded-md">
          {items.map((item) => {
            const isActive = pathname === item.href || (pathname !== "/m3-performance" && pathname?.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-1.5 text-sm font-semibold rounded-sm transition-all focus-visible:outline-none shrink-0",
                  isActive ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-muted-foreground">인사총무팀</p>
          <p className="text-sm font-bold text-primary">김경호 관리자</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold shrink-0">KH</div>
      </div>
    </nav>
  );
}
