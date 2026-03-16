import Link from "next/link";
import { NavSidebar } from "@/components/nav-sidebar";

export default function RepoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { owner: string; name: string };
}) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-semibold">
            {params.owner}/{params.name}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <NavSidebar owner={params.owner} name={params.name} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
