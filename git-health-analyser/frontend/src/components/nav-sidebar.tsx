"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavSidebarProps {
  owner: string;
  name: string;
}

const navItems = [
  { label: "Overview", path: "" },
  { label: "Commits", path: "/commits" },
  { label: "Contributors", path: "/contributors" },
  { label: "Pull Requests", path: "/pull-requests" },
  { label: "Issues", path: "/issues" },
  { label: "CI/CD", path: "/cicd" },
  { label: "Risks", path: "/risks" },
];

export function NavSidebar({ owner, name }: NavSidebarProps) {
  const pathname = usePathname();
  const basePath = `/repo/${owner}/${name}`;

  return (
    <nav className="w-48 shrink-0">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const href = `${basePath}${item.path}`;
          const isActive =
            item.path === ""
              ? pathname === basePath
              : pathname === href;

          return (
            <li key={item.path}>
              <Link
                href={href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
